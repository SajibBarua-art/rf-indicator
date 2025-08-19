import {
  Component,
  computed,
  inject,
  Input,
  signal,
  OnInit,
} from '@angular/core';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { CreateTargetSetupFormComponent } from '../../components/form/create-target-setup-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { TargetSetupCommandService } from '../../services/target-setup-command.service';
import {
  AvailableTimePeriod,
  FrequencyOption,
  TargetSetupCommandPayload,
} from '../../data/target-setup.type';
import { UtilityService } from '@platform-ui/platform-core/services';
import { SidebarOffsetWidthDirective } from '@/app/shared/directives/sidebar-width.directive';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import {
  FrequencyType,
  TIME_PERIOD_FREQUENCY_WISE_TIME_PERIOD,
} from '../../data/constants/target-setup.constant';

@Component({
  selector: 'app-create-target-setup',
  standalone: true,
  templateUrl: './create-target-setup.component.html',
  imports: [
    PlatformButtonComponent,
    CreateTargetSetupFormComponent,
    MatIcon,
    TranslocoModule,
    SidebarOffsetWidthDirective,
    CommonModule,
  ],
})
export class CreateTargetSetupComponent implements OnInit {
  @Input() TargetSetupForm: FormGroup;
  @Input() targetSetup: TargetSetupCommandPayload | null = null;
  IndicatorStatementId: [number, string] = [0, ''];
  TimePeriodId: [number, string] = [0, ''];
  FrequencyId: [number, string] = [0, ''];
  TargetValue: number = 0;

  private readonly fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  readonly isLoading = signal(false);
  private readonly utilityService = inject(UtilityService);
  readonly isEdit = computed(() => !!this.activatedRoute.snapshot.params['id']);
  private targetSetupCommandService = inject(TargetSetupCommandService);
  readonly targetSetupData = signal<TargetSetupCommandPayload>(
    this.activatedRoute.snapshot.data['targetSetup']
  );

  availableTimePeriods = signal<AvailableTimePeriod>([]);

  timePeriodFrequencyWiseTimePeriod = TIME_PERIOD_FREQUENCY_WISE_TIME_PERIOD;

  readonly isView = computed(
    () => !!this.activatedRoute.snapshot.data['isView']
  );

  readonly confirmMessage = signal(
    'Are you sure you want to save this "Target Setup"?'
  );

  ngOnInit(): void {
    this.initializeComponent();
    this.setupForm();
    this.handleEditMode();
  }

  private initializeComponent(): void {
    this.targetSetup = this.activatedRoute.snapshot.data['targetSetup'] || null;
  }

  private setupForm(): void {
    const numValidator = [Validators.required, Validators.pattern('^[0-9]*$')];

    this.TargetSetupForm = this.fb.group({
      indicatorStatement: ['', Validators.required],
      year: ['', Validators.required],
      timePeriodFrequency: [0, Validators.required],
      timePeriod: [{ value: 0, disabled: true }, Validators.required],
      targetDetails: this.fb.group({
        targetNumber: ['', numValidator],
        targetPercentage: ['', [...numValidator, Validators.max(100)]],
        disaggregationBoys: [0, numValidator],
        disaggregationGirls: [0, numValidator],
        disaggregationTransgender: [0, numValidator],
        disaggregationPwdBoys: [0, numValidator],
        disaggregationPwdGirls: [0, numValidator],
        disaggregationPwdTransgender: [0, numValidator],
        source: ['', Validators.required],
        calculationMethodology: ['', Validators.required],
      }),
    });
  }

  private handleEditMode(): void {
    if (this.isEdit()) {
      const targetSetup = this.targetSetupData();
      if (targetSetup) {
        this.populateFormWithData(targetSetup);
      }
    }
  }

  private populateFormWithData(targetSetup): void {
    const yearDate = new Date(parseInt(targetSetup.Year, 10), 0, 1);
    const frequencyValue = targetSetup.TimePeriodFrequency.Value;
    const timePeriodValue = targetSetup.TimePeriod.Value;

    this.TargetSetupForm.patchValue(
      {
        indicatorStatement: targetSetup.IndicatorId,
        year: yearDate,
        timePeriodFrequency: targetSetup.TimePeriodFrequency.Value,
        timePeriod: targetSetup.TimePeriod.Value,
        targetDetails: {
          targetNumber: targetSetup.TargetUnit.Number,
          targetPercentage: targetSetup.TargetUnit.Percentage,
          disaggregationBoys: targetSetup.TargetDisaggregation.TargetBoysNumber,
          disaggregationGirls:
            targetSetup.TargetDisaggregation.TargetGirlsNumber,
          disaggregationTransgender:
            targetSetup.TargetDisaggregation.TargetTransgenderNumber,
          disaggregationPwdBoys:
            targetSetup.TargetDisaggregation.TargetPWDBoysNumber,
          disaggregationPwdGirls:
            targetSetup.TargetDisaggregation.TargetPWDGirlsNumber,
          disaggregationPwdTransgender:
            targetSetup.TargetDisaggregation.TargetPWDTransgenderNumber,
          source: targetSetup.TargetSource,
          calculationMethodology: targetSetup.CalculationMethodology,
        },
      },
      { emitEvent: false }
    );

    const timePeriods =
      this.timePeriodFrequencyWiseTimePeriod.find(
        (f: FrequencyOption) => f.value === frequencyValue
      )?.timePeriod || [];

    this.availableTimePeriods.set(timePeriods);

    this.TargetSetupForm.get('timePeriod')?.setValue(timePeriodValue, {
      emitEvent: false,
    });

    if (frequencyValue !== FrequencyType.YEARLY) {
      this.TargetSetupForm.get('timePeriod')?.enable();
    }

    this.TargetSetupForm.updateValueAndValidity();
  }

  refreshPage(): void {
    if (this.isEdit() && this.targetSetup) {
      this.populateFormWithData(this.targetSetup);
    } else {
      this.setupForm();
    }
  }

  private goBack(): void {
    this.router.navigate(['/target-setup']);
  }

  onCancel(): void {
    this.goBack();
  }

  private safeNumber(value): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  public submitForm(): void {
    if (this.TargetSetupForm.invalid) {
      this.TargetSetupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.TargetSetupForm?.value;

    const payload: TargetSetupCommandPayload = {
      IndicatorId: formValue?.indicatorStatement,
      Year: this.safeNumber(formValue?.year?.getFullYear()),
      TimeFrequencyId: this.safeNumber(formValue?.timePeriodFrequency),
      TimePeriodId: this.safeNumber(formValue?.timePeriod),
      TargetNumber: this.safeNumber(formValue?.targetDetails?.targetNumber),
      TargetPercentage: this.safeNumber(
        formValue?.targetDetails?.targetPercentage
      ),
      TargetBoysNumber: this.safeNumber(
        formValue?.targetDetails?.disaggregationBoys
      ),
      TargetGirlsNumber: this.safeNumber(
        formValue?.targetDetails?.disaggregationGirls
      ),
      TargetTransgenderNumber: this.safeNumber(
        formValue?.targetDetails?.disaggregationTransgender
      ),
      TargetPWDBoysNumber: this.safeNumber(
        formValue?.targetDetails?.disaggregationPwdBoys
      ),
      TargetPWDGirlsNumber: this.safeNumber(
        formValue?.targetDetails?.disaggregationPwdGirls
      ),
      TargetPWDTransgenderNumber: this.safeNumber(
        formValue?.targetDetails?.disaggregationPwdTransgender
      ),
      Source: formValue?.targetDetails?.source,
      CalculationMethodology: formValue?.targetDetails?.calculationMethodology,
    };

    if (this.isEdit()) {
      payload.IndicatorTargetId = this.targetSetupData()?.Id;
    }

    const serviceCall = this.isEdit()
      ? this.targetSetupCommandService.Update(payload)
      : this.targetSetupCommandService.Create(payload);

    serviceCall.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: response => {
        // console.log('Target Setup saved successfully:', response);
        this.goBack();
      },
      error: error => {
        console.error('Error saving Target Setup:', error);
      },
    });
  }
}
