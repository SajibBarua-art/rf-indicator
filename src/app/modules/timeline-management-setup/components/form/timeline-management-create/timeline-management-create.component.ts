import {
  InstituteTypes,
  OptionsCategories,
  RegionLocation,
} from '@/app/modules/indicator-breakdown/data/indicator-breakdown.type';
import { IndicatorBreakdownService } from '@/app/modules/indicator-breakdown/service/indicator-breakdown.query.service';
import { DropdownOptionType } from '@/app/shared/data/type/bep.type';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { filter, Observable, tap } from 'rxjs';
import {
  DATA_FREQUENCIES,
  REPORTING_FREQUENCIES,
} from '../../../data/timeline-setup.constant';
import { ActivatedRoute } from '@angular/router';
function dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startKey)?.value;
    const end = group.get(endKey)?.value;
    if (start && end && new Date(end) < new Date(start)) {
      return { dateRangeInvalid: true };
    }
    return null;
  };
}

function nonNegativeValidator(
  control: AbstractControl
): ValidationErrors | null {
  return control.value != null && control.value < 0
    ? { negativeNotAllowed: true }
    : null;
}
@Component({
  selector: 'app-timeline-management-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepicker,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './timeline-management-create.component.html',
})
export class TimelineManagementCreateComponent {
  private readonly indicatorService = inject(IndicatorBreakdownService);
  OperationCategories: { value: string; label: string }[] = [];
  InstituteTypes: { value: string; label: string }[] = [];
  DivisionList: DropdownOptionType[] = [];
  DistrictList: DropdownOptionType[] = [];
  UpazilaList: DropdownOptionType[] = [];
  InstituteList: DropdownOptionType[] = [];
  private activatedRoute = inject(ActivatedRoute);
  DATA_FREQUENCIES = DATA_FREQUENCIES;
  REPORTING_FREQUENCIES = REPORTING_FREQUENCIES;
  minEndDate: Date | null = null;
  TargetManagementFrom!: FormGroup;
  private readonly fb = inject(FormBuilder);
  readonly isEdit = computed(() => !!this.activatedRoute.snapshot.params['id']);
  readonly timalineManagement = signal<any>(
    this.activatedRoute.snapshot.data['timalineManagement']
  );
  ngOnInit(): void {
    console.log('isEdit', this.isEdit(), this.timalineManagement());

    this.initializeTargetManagementForm();
    this.getCategories();
    this.getInstituteType();
    this.handleFrequencyChange();
    if (this.isEdit()) {
      const timalineManagement = this.timalineManagement();
      if (timalineManagement) {
        // Step 1: Patch the top-level values first
        this.TargetManagementFrom.patchValue({
          TimelineId: timalineManagement?.TimelineId,
          OperationCategoryId: timalineManagement?.OperationCategory?.ItemId,
          InstituteTypeId: timalineManagement?.InstituteType?.ItemId,
          StartDate: timalineManagement?.DateRange?.StartDate
            ? new Date(timalineManagement.DateRange.StartDate.split('T')[0])
            : null,
          EndDate: timalineManagement?.DateRange?.EndDate
            ? new Date(timalineManagement.DateRange.EndDate.split('T')[0])
            : null,
          DataCollectionFrequencyId:
            timalineManagement?.DataCollectionFrequency?.Value,
          ReportingFrequencyId: timalineManagement?.ReportingFrequency?.Value,
          DataCollectionDeadlineInDays:
            timalineManagement?.DataCollectionDeadlineInDays,
          InstituteList: timalineManagement?.Institute?.ItemId,
          Reason: timalineManagement?.Reason,
        });
        this.loadRegion(timalineManagement?.InstituteType?.Value).subscribe(
          divisions => {
            this.DivisionList = divisions;
            const selectedDivision = divisions.find(
              d => d.Value === timalineManagement?.Division?.SourceId
            );
            this.TargetManagementFrom.patchValue({
              DivisionList: selectedDivision,
            });

            this.loadArea([timalineManagement?.Division?.SourceId]).subscribe(
              districts => {
                this.DistrictList = districts;
                const selectedDistrict = districts.find(
                  d => d.Value === timalineManagement?.District?.SourceId
                );
                this.TargetManagementFrom.patchValue({
                  DistrictList: selectedDistrict,
                });

                if (timalineManagement?.Upazila) {
                  this.loadBranch([
                    timalineManagement?.District?.SourceId,
                  ]).subscribe(upazilas => {
                    this.UpazilaList = upazilas;
                    const selectedUpazila = upazilas.find(
                      u => u.Value === timalineManagement?.Upazila?.SourceId
                    );
                    this.TargetManagementFrom.patchValue({
                      UpazilaList: selectedUpazila,
                    });
                  });
                }
              }
            );
          }
        );
      }
    }

    this.TargetManagementFrom.get('EndDate')?.disable();

    this.TargetManagementFrom.get('StartDate')?.valueChanges.subscribe(
      start => {
        const endDateControl = this.TargetManagementFrom.get('EndDate');

        if (!start) {
          endDateControl?.disable();
          endDateControl?.reset();
        } else {
          endDateControl?.enable();
          this.minEndDate = start;
        }
      }
    );

    this.TargetManagementFrom.get('ReportingFrequencyId')?.disable();

    this.loadInstitute(null).subscribe({
      next: options => {
        console.log('Initial Institute options', options);
        this.InstituteList = options;
      },
      error: error => {
        console.error('Error loading institute:', error);
      },
    });
    this.TargetManagementFrom.get('InstituteTypeId')
      ?.valueChanges.pipe(
        filter(value => !!value),
        tap((instituteTypeId: string) => {
          this.TargetManagementFrom.get('DivisionList')?.reset();
          this.TargetManagementFrom.get('DistrictList')?.reset();
          this.TargetManagementFrom.get('UpazilaList')?.reset();
          const selectedItem = this.InstituteTypes.find(
            item => item.value === instituteTypeId
          );
          if (!selectedItem) return;

          this.loadRegion(selectedItem.label).subscribe({
            next: options => {
              console.log('options', options);
              this.DivisionList = options;
            },
            error: error => {
              console.error('Error loading region:', error);
            },
          });
        })
      )
      .subscribe();
    this.TargetManagementFrom.get('DivisionList')
      ?.valueChanges.pipe(
        filter(value => !!value),
        tap(division => {
          console.log('division', division);
          this.TargetManagementFrom.get('DistrictList')?.reset();
          this.TargetManagementFrom.get('UpazilaList')?.reset();
          const sourceIds = Array.isArray(division)
            ? division.map(d => d.Value)
            : [division.Value];
          console.log('sourceIds', sourceIds);
          this.loadArea(sourceIds).subscribe({
            next: options => {
              console.log('options', options);
              this.DistrictList = options;
            },
            error: error => {
              console.error('Error loading region:', error);
            },
          });
        })
      )
      .subscribe();
    this.TargetManagementFrom.get('DistrictList')
      ?.valueChanges.pipe(
        filter(value => !!value),
        tap(district => {
          console.log('district', district);
          this.TargetManagementFrom.get('UpazilaList')?.reset();
          const sourceIds = Array.isArray(district)
            ? district.map(d => d.Value)
            : [district.Value];
          this.loadBranch(sourceIds).subscribe({
            next: options => {
              console.log('options', options);
              this.UpazilaList = options;
            },
            error: error => {
              console.error('Error loading region:', error);
            },
          });
        })
      )
      .subscribe();

    this.TargetManagementFrom.get('UpazilaList')
      ?.valueChanges.pipe(
        tap(upazilas => {
          console.log('district', upazilas);

          const sourceIds = upazilas
            ? Array.isArray(upazilas)
              ? upazilas.map(d => d.Value)
              : [upazilas.Value]
            : null;
          this.loadInstitute(sourceIds).subscribe({
            next: options => {
              console.log('Institute options', options);
              this.InstituteList = options;
            },
            error: error => {
              console.error('Error loading institute:', error);
            },
          });
        })
      )
      .subscribe();
  }
  initializeTargetManagementForm() {
    this.TargetManagementFrom = this.fb.group(
      {
        TimelineId: [''],
        OperationCategoryId: ['', Validators.required],
        InstituteTypeId: ['', Validators.required],
        DivisionList: [''],
        DistrictList: [''],
        UpazilaList: [''],
        InstituteList: [''],
        StartDate: ['', Validators.required],
        EndDate: ['', Validators.required],
        DataCollectionFrequencyId: ['', Validators.required],
        ReportingFrequencyId: ['', Validators.required],
        DataCollectionDeadlineInDays: [
          '',
          [
            Validators.required,
            nonNegativeValidator,
            Validators.min(1),
            Validators.max(31),
          ],
        ],
        Reason: ['', [Validators.maxLength(120)]],
      },
      {
        validators: [dateRangeValidator('StartDate', 'EndDate')],
      }
    );
  }
  private handleFrequencyChange(): void {
    this.TargetManagementFrom.get('DataCollectionFrequencyId')
      ?.valueChanges.pipe(
        tap(selectedValue => {
          if (!selectedValue) {
            this.TargetManagementFrom.get('ReportingFrequencyId')?.disable();
            this.REPORTING_FREQUENCIES = REPORTING_FREQUENCIES;
          } else {
            this.TargetManagementFrom.get('ReportingFrequencyId')?.enable();
            switch (selectedValue) {
              case 1:
                this.REPORTING_FREQUENCIES = REPORTING_FREQUENCIES;
                break;
              case 2:
                this.REPORTING_FREQUENCIES = REPORTING_FREQUENCIES.filter(
                  r => r.value !== 1
                );
                break;
              case 3:
                this.REPORTING_FREQUENCIES = REPORTING_FREQUENCIES.filter(
                  r => r.value !== 2 && r.value !== 1
                );
                break;
              case 4:
                this.REPORTING_FREQUENCIES = REPORTING_FREQUENCIES.filter(
                  r => r.value !== 3 && r.value !== 2 && r.value !== 1
                );
                break;
            }
          }
        })
      )
      .subscribe();
  }
  loadRegion(instituteTypeValue: string): Observable<DropdownOptionType[]> {
    console.log('instituteTypeValue', instituteTypeValue);

    return new Observable(observer => {
      this.indicatorService
        .getRegionByInstituteType(instituteTypeValue)
        .subscribe({
          next: (regions: RegionLocation[]) => {
            const options = regions.map(item => ({
              Label: item.Name,
              Value: item.SourceId,
              Id: item.Id,
            }));
            observer.next(options);
            observer.complete();
          },
          error: err => observer.error(err),
        });
    });
  }
  loadArea(regionIds: string[]): Observable<DropdownOptionType[]> {
    console.log('hello', regionIds);
    const regionIdArray = Array.isArray(regionIds) ? regionIds : [regionIds];
    return new Observable(observer => {
      this.indicatorService.getAreaListByRegion(regionIdArray).subscribe({
        next: (areas: RegionLocation[]) => {
          const options = areas.map(item => ({
            Label: item.Name,
            Value: item.SourceId,
            Id: item.Id,
          }));
          observer.next(options);
          observer.complete();
        },
        error: err => observer.error(err),
      });
    });
  }
  loadBranch(areaIds: string[]): Observable<DropdownOptionType[]> {
    const areaIdsArray = Array.isArray(areaIds) ? areaIds : [areaIds];

    return new Observable(observer => {
      this.indicatorService.getBranchListByArea(areaIdsArray).subscribe({
        next: (branches: RegionLocation[]) => {
          const options = branches.map(item => ({
            Label: item.Name,
            Value: item.SourceId,
            Id: item.Id,
            // HierarchyId: item.HierarchyId,
          }));
          observer.next(options);
          observer.complete();
        },
        error: err => observer.error(err),
      });
    });
  }
  loadInstitute(
    upazillaIds: string[] | null
  ): Observable<DropdownOptionType[]> {
    return new Observable(observer => {
      const apiCall = upazillaIds
        ? this.indicatorService.getInstituteListByUpazilla(upazillaIds)
        : this.indicatorService.getInstituteListByUpazilla();

      apiCall.subscribe({
        next: (institutes: RegionLocation[]) => {
          const options = institutes.map(item => ({
            Label: item.Name,
            Value: item.Id,
          }));
          observer.next(options);
          observer.complete();
        },
        error: err => observer.error(err),
      });
    });
  }

  getInstituteType(): void {
    this.indicatorService.getInstitueType().subscribe({
      next: (response: InstituteTypes[]) => {
        console.log('response', response);

        this.InstituteTypes = response.map(item => ({
          value: item.Id,
          label: item.Value,
        }));
      },
      error: error => {
        console.error('Institute type fetch error', error);
      },
    });
  }

  getCategories(): void {
    this.indicatorService.getCategories().subscribe({
      next: (response: OptionsCategories[]) => {
        this.OperationCategories = response.map(item => ({
          value: item.Id,
          label: item.Value,
        }));
      },
      error: error => {
        console.error('Category fetch error', error);
      },
    });
  }
}
