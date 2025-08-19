import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EditFormComponent } from '../../components/edit-form/edit-form.component';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  LocationList,
  RegionLocation,
  UserRole,
} from '../../data/indicator-breakdown.type';
import { IndicatorBreakdownService } from '../../service/indicator-breakdown.query.service';
import { IndicatorBreakdownCommandService } from '../../service/indicator-breakdown.command.service';
import {
  OptionsCategories,
  InstituteTypes,
} from '../../data/indicator-breakdown.type';
import { RFIndicatorCommandPayload } from '@/app/modules/rf-indicator/data/rf-indicator.type';
import { filter, Observable, tap } from 'rxjs';
import { DropdownOptionType } from '@/app/shared/data/type/bep.type';
import { SidebarOffsetWidthDirective } from '@/app/shared/directives/sidebar-width.directive';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';
import { INDICATOR_BREAKDOWN_FEATURE } from '../../data/indicator-breakdown.constant';

@Component({
  selector: 'app-indicator-breakdown-edit',
  standalone: true,
  templateUrl: './indicator-breakdown-edit.component.html',
  styleUrl: './indicator-breakdown-edit.component.css',
  imports: [
    CommonModule,
    EditFormComponent,
    PlatformButtonComponent,
    MatIconModule,
    TranslocoModule,
    SidebarOffsetWidthDirective,
    PlatformFeatureGuardModule,
  ],
})
export class IndicatorBreakdownEditComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly indicatorService = inject(IndicatorBreakdownService);
  private readonly indicatorCommandService = inject(
    IndicatorBreakdownCommandService
  );
  INDICATOR_BREAKDOWN_FEATURE = INDICATOR_BREAKDOWN_FEATURE;
  breakdownLoading = false;
  regionOptions: DropdownOptionType[] = [];
  areaOptions: DropdownOptionType[] = [];
  IndicatorEditForm!: FormGroup;
  breakdownform!: FormGroup;
  OperationCategories: { value: string; label: string }[] = [];
  InstituteTypes: { value: string; label: string }[] = [];
  System: { value: number; label: string }[] = [];

  DivisionList: DropdownOptionType[] = [];
  DistrictList: DropdownOptionType[] = [];
  UpazilaList: DropdownOptionType[] = [];
  UserRoleMaker: { value: string; label: string }[] = [];
  UserRoleChecker: { value: string; label: string }[] = [];
  ValidatorField: { value: string; label: string }[] = [];
  ValidatorHo: { value: string; label: string }[] = [];
  divisionToDistrictMap: { [key: string]: string[] } = {};
  districtToUpazilaMap: { [key: string]: string[] } = {};
  readonly rfBreakdOwnIndicator = signal<any>(
    this.activatedRoute.snapshot.data['rfBreakdOwnIndicator']
  );

  readonly isEdit = computed(() => !!this.activatedRoute.snapshot.params['id']);
  readonly isLoading = computed(
    () => this.activatedRoute.snapshot.data['isLoading']
  );

  private groupBreakdownsByLayer(flatBreakdowns: any[]): any[] {
    const maxLayer = Math.max(
      ...flatBreakdowns.map(b => b.IndicatorNumber.split('.').length - 1)
    );
    const layers: any[] = [];
    for (let i = 1; i <= maxLayer; i++) {
      layers.push({
        breakdowns: flatBreakdowns.filter(
          b => b.IndicatorNumber.split('.').length - 1 === i
        ),
      });
    }
    return layers;
  }
  initializeForm(): void {
    this.IndicatorEditForm = this.fb.group({
      OperationCategory: ['', Validators.required],
      InstituteType: ['', Validators.required],

      Division: [],
      DivisionList: [''],
      getLocations: [''],
      District: [],
      DistrictList: [''],
      Upazila: [],
      UpazilaList: [''],
      UserRoleMaker: ['', Validators.required],
      UserRoleChecker: [''],
      ValidatorField: [''],
      ValidatorHo: ['', Validators.required],
    });
    this.breakdownform = this.fb.group({
      layers: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    console.log('rfBreakdOwnIndicator', this.rfBreakdOwnIndicator());

    this.initializeForm();
    this.getCategories();
    this.getInstituteType();
    this.getUserRoles();

    this.IndicatorEditForm.get('InstituteType')
      ?.valueChanges.pipe(
        filter(value => !!value),
        tap((instituteTypeId: string) => {
          this.IndicatorEditForm.get('DivisionList')?.reset();
          this.IndicatorEditForm.get('DistrictList')?.reset();
          this.IndicatorEditForm.get('UpazilaList')?.reset();
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

    this.IndicatorEditForm.get('DivisionList')
      ?.valueChanges.pipe(
        filter(value => !!value),
        tap(division => {
          this.IndicatorEditForm.get('DistrictList')?.reset();
          this.IndicatorEditForm.get('UpazilaList')?.reset();
          this.loadArea(division).subscribe({
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
    this.IndicatorEditForm.get('DistrictList')
      ?.valueChanges.pipe(
        filter(value => !!value),
        tap(district => {
          console.log('district', district);

          this.loadBranch(district).subscribe({
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
  }
  patchEditModeData(): void {
    const data = this.rfBreakdOwnIndicator();
    console.log('data', data);

    if (!data) return;

    const instituteTypeItem = this.InstituteTypes.find(
      item => item.value === data.InstituteTypeId
    );

    const getUserCategoryId = (displayName: string) =>
      data.DataApprovers?.find(a => a.ApproverType?.DisplayName === displayName)
        ?.Participant?.UserCategoryId || null;
    if (instituteTypeItem) {
      this.loadRegion(instituteTypeItem.label).subscribe({
        next: options => {
          this.DivisionList = options;

          this.IndicatorEditForm.patchValue({
            OperationCategory: data.OperationCategoryId,
            InstituteType: data.InstituteTypeId,
            DivisionList: data.LocationConfiguration?.DivisionSourceIds,
            DistrictList: data.LocationConfiguration?.DistrictSourceIds,
            UpazilaList: data.LocationConfiguration?.UpazilaSourceIds,
            UserRoleMaker: data.DataMaker?.UserCategoryId,
            UserRoleChecker: getUserCategoryId('DataChecker'),
            ValidatorField: getUserCategoryId('FieldValidator'),
            ValidatorHo: getUserCategoryId('HeadOfficeValidator'),
          });
        },
      });
      const flatBreakdowns = this.rfBreakdOwnIndicator().LayerBreakdowns;
      if (flatBreakdowns && flatBreakdowns.length > 0) {
        console.log('flatBreakdowns', flatBreakdowns);

        const layers = this.groupBreakdownsByLayer(flatBreakdowns);
        console.log('layers', layers);

        const layersFormArray = this.fb.array(
          layers.map(layer =>
            this.fb.group({
              breakdowns: this.fb.array(
                layer.breakdowns.map((b: any) =>
                  this.fb.group({
                    IndicatorNumber: [
                      { value: b.IndicatorNumber, disabled: true },
                      Validators.required,
                    ],
                    IndicatorStatement: [
                      b.IndicatorStatement,
                      Validators.required,
                    ],
                    System: [b.SourceId, Validators.required],
                    SourceType: [
                      b.SourceType?.Value || b.SourceType,
                      Validators.required,
                    ],
                  })
                )
              ),
            })
          )
        );

        this.breakdownform.setControl('layers', layersFormArray);
      }
    }
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
            }));
            observer.next(options);
            observer.complete();
          },
          error: err => observer.error(err),
        });
    });
  }

  loadArea(regionIds: string[]): Observable<DropdownOptionType[]> {
    return new Observable(observer => {
      this.indicatorService.getAreaListByRegion(regionIds).subscribe({
        next: (areas: RegionLocation[]) => {
          const options = areas.map(item => ({
            Label: item.Name,
            Value: item.SourceId,
          }));
          observer.next(options);
          observer.complete();
        },
        error: err => observer.error(err),
      });
    });
  }
  loadBranch(areaIds: string[]): Observable<DropdownOptionType[]> {
    console.log('areaIds', areaIds);

    return new Observable(observer => {
      this.indicatorService.getBranchListByArea(areaIds).subscribe({
        next: (branches: RegionLocation[]) => {
          const options = branches.map(item => ({
            Label: item.Name,
            Value: item.SourceId,
            // HierarchyId: item.HierarchyId,
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
        this.InstituteTypes = response.map(item => ({
          value: item.Id,
          label: item.Value,
        }));

        this.patchEditModeData();
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

  getUserRoles(): void {
    this.indicatorService.getUserRole().subscribe({
      next: (response: UserRole[]) => {
        this.UserRoleMaker = response.map(item => ({
          value: item.Id,
          label: item.Value,
        }));
        this.UserRoleChecker = response.map(item => ({
          value: item.Id,
          label: item.Value,
        }));

        this.ValidatorField = response.map(item => ({
          value: item.Id,
          label: item.Value,
        }));

        this.ValidatorHo = response.map(item => ({
          value: item.Id,
          label: item.Value,
        }));
      },
      error: error => {
        console.error('Category fetch error', error);
      },
    });
  }

  onCancel(): void {
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/indicator_breakdown_configuration']);
  }

  refreshPage(): void {
    this.IndicatorEditForm.reset();
  }
  private logRequiredFields(
    formGroup: FormGroup | any,
    parentKey: string = ''
  ): void {
    Object.keys(formGroup.controls).forEach(key => {
      const controlPath = parentKey ? `${parentKey}.${key}` : key;
      const control = formGroup.get(key);

      if (control instanceof FormGroup || control instanceof FormGroup) {
        this.logRequiredFields(control, controlPath);
      } else if (control?.errors?.['required']) {
        console.warn(`⚠️ Required field missing: ${controlPath}`);
      }
    });
  }

  submitForm(): void {
    // Auto-set System for SourceType !== 1 before validation
    // this.breakdownform
    //   .get('layers')
    //   ?.value.forEach((layer: any, layerIndex: number) => {
    //     layer.breakdowns.forEach((breakdown: any, breakdownIndex: number) => {
    //       const sourceTypeControl = this.breakdownform.get(
    //         `layers.${layerIndex}.breakdowns.${breakdownIndex}.SourceType`
    //       );
    //       const systemControl = this.breakdownform.get(
    //         `layers.${layerIndex}.breakdowns.${breakdownIndex}.System`
    //       );
    //       console.log("sourceTypeControl", sourceTypeControl, systemControl);

    //       if (sourceTypeControl?.value !== 1) {
    //         systemControl?.setValue('11aec13d-e9dc-4c6a-b724-306ce2139af7', {
    //           emitEvent: false,
    //         });

    //       }
    //     });
    //   });

    console.log('Form Valid:', this.breakdownform.valid);
    console.log('Form Errors:', this.breakdownform.errors);
    console.log('Full Form Value:', this.breakdownform.getRawValue());

    this.breakdownLoading = true;
    const breakdownInvalid = !this.breakdownform || this.breakdownform.invalid;

    if (
      !this.IndicatorEditForm ||
      this.IndicatorEditForm.invalid ||
      breakdownInvalid
    ) {
      this.logRequiredFields(this.breakdownform);
      console.log('hello');
      this.breakdownform?.markAllAsTouched();
      this.IndicatorEditForm?.markAllAsTouched();
      this.breakdownLoading = false;
      return;
    }

    const form = this.IndicatorEditForm?.value;
    const breakdown = this.breakdownform?.getRawValue();

    const getUserRoleObject = (value: string, list: any[]) => {
      return (
        list.find(item => item.value === value) || { value: value, label: '' }
      );
    };

    const payload = {
      IndicatorId: this.activatedRoute.snapshot.paramMap.get('id') || '',
      OperationCategoryId: form?.OperationCategory,
      InstituteTypeId: form?.InstituteType,
      LayerBreakdowns: breakdown.layers
        .flatMap((layer: any) => layer.breakdowns)
        .map((b: any) => ({
          IndicatorNumber: b.IndicatorNumber || '',
          IndicatorStatement: b?.IndicatorStatement,
          SourceTypeId: b.SourceType,
          SourceId:
            b.SourceType === 1
              ? b?.System
              : '11aec13d-e9dc-4c6a-b724-306ce2139af7',
        })),
      LocationConfiguration: {
        DivisionSourceIds: form?.DivisionList || [],
        DistrictSourceIds: form?.DistrictList || [],
        UpazilaSourceIds: form?.UpazilaList || [],
      },
      DataMaker: {
        UserCategoryId: form?.UserRoleMaker,
        UserCategory: getUserRoleObject(form?.UserRoleMaker, this.UserRoleMaker)
          .label,
      },
      DataChecker: {
        UserCategoryId: form?.UserRoleChecker,
        UserCategory: getUserRoleObject(
          form?.UserRoleChecker,
          this.UserRoleChecker
        ).label,
      },
      FieldValidator: {
        UserCategoryId: form?.ValidatorField,
        UserCategory: getUserRoleObject(
          form?.ValidatorField,
          this.ValidatorField
        ).label,
      },
      HeadOfficeValidator: {
        UserCategoryId: form?.ValidatorHo,
        UserCategory: getUserRoleObject(form?.ValidatorHo, this.ValidatorHo)
          .label,
      },
    };
    if (!form?.UserRoleChecker) {
      payload.DataChecker = null;
    }

    if (!form?.ValidatorField) {
      payload.FieldValidator = null;
    }

    console.log('Payload:', payload);

    this.indicatorCommandService.Update(payload).subscribe({
      next: res => {
        console.log('res', res);
        this.breakdownLoading = false;
        this.goBack();
      },
      error: err => {
        console.error('Update failed:', err);
        this.breakdownLoading = false;
      },
    });
  }
}
