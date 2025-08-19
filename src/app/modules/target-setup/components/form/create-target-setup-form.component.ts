import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import {
  TIME_PERIOD_FREQUENCY_WISE_TIME_PERIOD,
  FrequencyType,
  QUARTER_MONTHS,
  HALF_YEAR_MONTHS,
  FIELD_CONFIGS,
  Quarter,
  HalfYear,
  isMonthly,
  isQuarterly,
  isHalfYearly,
  isYearly,
} from '../../data/constants/target-setup.constant';
import {
  FormControlType,
  TimePeriodOption,
  FrequencyOption,
  AvailableTimePeriod,
} from '../../data/target-setup.type';
import { RfIndicatorQueryService } from '@/app/modules/rf-indicator/services/rf-indicator-query.service';
import { RFIndicatorCommandPayload } from '@/app/modules/rf-indicator/data/rf-indicator.type';
import { TargetSetupQueryService } from '../../services/target-setup-query.service';

@Component({
  selector: 'app-create-target-setup-form',
  standalone: true,
  templateUrl: './create-target-setup-form.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepicker,
    MatDatepickerToggle,
  ],
  styleUrl: './create-target-setup-form.component.scss',
})
export class CreateTargetSetupFormComponent implements OnInit {
  @Input() TargetSetupForm: FormGroup;
  @Input() isEdit: boolean = false;
  minDate: Date;
  private rfIndicatorQueryService = inject(RfIndicatorQueryService);

  public get targetDetails(): FormGroup {
    return this.TargetSetupForm.get('targetDetails') as FormGroup;
  }

  // This will hold the dynamic options for the "Time Period Frequency" dropdown
  public availableTimePeriodFrequencies: FrequencyOption[] = [];
  // This will hold the dynamic options for the "Time Period" dropdown
  @Input() availableTimePeriods: AvailableTimePeriod = [];
  public currentDate = new Date();
  public currentMonth = this.currentDate.getMonth() + 1; // 1-12
  public currentYear = this.currentDate.getFullYear();

  timePeriodFrequencyWiseTimePeriod = TIME_PERIOD_FREQUENCY_WISE_TIME_PERIOD;
  fieldConfigs = FIELD_CONFIGS;

  constructor(private fb: FormBuilder) {
    this.minDate = new Date(this.currentYear, 0, 1); // January 1st of current year
  }

  // Properties to hold the data or error message for the template
  public indicators: RFIndicatorCommandPayload[] | null = null;
  public errorMessage: string | null = null;

  // This will hold the transformed data in the desired format
  public indicatorStatement: { value: string; label: string }[] = [];

  ngOnInit(): void {
    this.fetchIndicatorsList();
    if (!this.isEdit) {
      this.setupFrequencyListener();
      this.setupYearListener();
      this.updateAvailableTimePeriodFrequencies();
    }

    // console.log("av: ", this.availableTimePeriods);
  }

  private fetchIndicatorsList(): void {
    this.rfIndicatorQueryService.getRFIndicators().subscribe({
      next: data => {
        this.indicatorStatement = data.map(indicator => {
          return {
            value: indicator.Id,
            label: indicator.Title,
          };
        });
      },
      error: err => {
        console.error('Failed to fetch indicators:', err);
        this.errorMessage = 'Could not load indicator data.';
        this.indicatorStatement = []; // Clear the array on error
      },
    });
  }

  private setupFrequencyListener(): void {
    const frequencyControl = this.TargetSetupForm.get(
      'timePeriodFrequency'
    ) as FormControlType;
    const timePeriodControl = this.TargetSetupForm.get(
      'timePeriod'
    ) as FormControlType;

    frequencyControl?.valueChanges.subscribe(frequencyValue => {
      this.handleFrequencyChange(frequencyValue, timePeriodControl);
    });
  }

  public handleFrequencyChange(
    frequencyValue: number,
    timePeriodControl: FormControlType
  ): void {
    // Reset the child dropdown
    timePeriodControl?.reset();
    this.availableTimePeriods = [];

    // console.log("value: ", frequencyValue);

    if (frequencyValue) {
      const selectedFrequency = this.timePeriodFrequencyWiseTimePeriod.find(
        (f: FrequencyOption) => f.value === frequencyValue
      );

      // Update the available options with disabled logic
      this.availableTimePeriods = selectedFrequency
        ? this.getAvailableTimePeriods(
            selectedFrequency.timePeriod,
            frequencyValue
          )
        : [];

      // Update validators
      this.updateTimePeriodValidators(timePeriodControl);
    }
  }

  private updateTimePeriodValidators(timePeriodControl: FormControlType): void {
    if (this.availableTimePeriods.length === 0) {
      timePeriodControl?.clearValidators();
      this.TargetSetupForm.get('timePeriod')?.disable();
    } else {
      timePeriodControl?.setValidators([Validators.required]);
      this.TargetSetupForm.get('timePeriod')?.enable();
    }
    timePeriodControl?.updateValueAndValidity();
  }

  private setupYearListener(): void {
    const yearControl = this.TargetSetupForm.get('year');
    yearControl?.valueChanges.subscribe((selectedYear: Date) => {
      this.updateAvailableTimePeriodFrequencies(selectedYear);
      // Optionally reset frequency and time period when year changes
      this.TargetSetupForm.get('timePeriodFrequency')?.reset();
      this.TargetSetupForm.get('timePeriod')?.reset();
    });
  }

  public updateAvailableTimePeriodFrequencies(selectedYear?: Date): void {
    let year: number | undefined;

    if (selectedYear instanceof Date) {
      year = selectedYear.getFullYear();
    }

    // If no valid year or year is in the future, show all options
    if (!year || year > this.currentYear) {
      this.availableTimePeriodFrequencies =
        this.timePeriodFrequencyWiseTimePeriod;
      return;
    }

    // Filter frequencies if year is current
    this.availableTimePeriodFrequencies =
      this.timePeriodFrequencyWiseTimePeriod.filter(freq => {
        if (freq.value === FrequencyType.YEARLY && year === this.currentYear) {
          return false;
        }
        if (
          freq.value === FrequencyType.HALF_YEARLY &&
          year === this.currentYear &&
          this.currentMonth >= 7
        ) {
          return false;
        }
        return true;
      });
  }

  getAvailableTimePeriods(
    timePeriods: TimePeriodOption[],
    frequencyValue: number
  ): AvailableTimePeriod {
    if (!timePeriods || timePeriods.length === 0) {
      return [];
    }

    // Get the selected year
    const year = this.TargetSetupForm.get('year')?.value;
    let selectedYear: number;

    if (year instanceof Date) {
      selectedYear = year.getFullYear();
    } else {
      return [];
    }

    // If no year is selected or year is in the future, show all options
    if (!selectedYear || selectedYear > this.currentYear) {
      return timePeriods;
    }

    // Only filter if the selected year is the current year
    const result = timePeriods.filter((period: TimePeriodOption) => {
      let shouldInclude = true;

      if (isMonthly(frequencyValue)) {
        shouldInclude = period.value > this.currentMonth;
      } else if (isQuarterly(frequencyValue)) {
        shouldInclude = !this.isQuarterDisabled(period.value);
      } else if (isHalfYearly(frequencyValue)) {
        shouldInclude = !this.isHalfYearlyDisabled(period.value);
      } else if (isYearly(frequencyValue)) {
        // For yearly, we don't disable any periods as they represent the whole year
        shouldInclude = true;
      } else {
        shouldInclude = true;
      }

      return shouldInclude;
    });

    return result;
  }

  isQuarterDisabled(quarterValue: number): boolean {
    const quarterMonthRange = QUARTER_MONTHS[quarterValue as Quarter];
    if (!quarterMonthRange) return false;

    // Check if current month is in this quarter (including current month)
    const isCurrentQuarter = quarterMonthRange.includes(this.currentMonth);
    const hasPastMonths = quarterMonthRange.some(
      month => month < this.currentMonth
    );

    // Disable if it's the current quarter or has past months
    const isDisabled = isCurrentQuarter || hasPastMonths;

    return isDisabled;
  }

  isHalfYearlyDisabled(halfYearValue: number): boolean {
    const halfYearMonthRange = HALF_YEAR_MONTHS[halfYearValue as HalfYear];
    if (!halfYearMonthRange) return false;

    // Check if current month is in this half year (including current month)
    const isCurrentHalfYear = halfYearMonthRange.includes(this.currentMonth);
    const hasPastMonths = halfYearMonthRange.some(
      month => month < this.currentMonth
    );

    // Disable if it's the current half year or has past months
    const isDisabled = isCurrentHalfYear || hasPastMonths;

    return isDisabled;
  }

  // --- HANDLER FOR YEAR-ONLY DATEPICKER ---
  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
    this.TargetSetupForm.get('year')?.setValue(normalizedYear);
    datepicker.close();
  }
}
