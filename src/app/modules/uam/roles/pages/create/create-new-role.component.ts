import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  PlatformButtonComponent,
  PlatformConfirmationService,
} from '@platform-ui/platform-bootstrap-template';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@/app/modules/uam/roles/data/types/role.type';
import { RoleService } from '../../services/role.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Feature } from '@/app/modules/uam/roles/data/types/feature.model';
import { CardComponent } from '@/app/shared/components/card/card.component';
import { RestrictInputDirective } from '../../validators/restrict-input.directive';
import { noWhitespaceValidator } from '../../validators/white-space-validator/white-space-validator';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'app-create-new-role',
  templateUrl: './create-new-role.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelHeader,
    MatDividerModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    CardComponent,
    RestrictInputDirective,
    PlatformButtonComponent,
    TranslocoDirective,
  ],
})
export class CreateNewRoleComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roleService = inject(RoleService);
  private _platformConfirmationService = inject(PlatformConfirmationService);

  role: Role;
  roleForm: FormGroup;
  waiting = false;
  private destroy$ = new Subject<void>();

  groupedFeatures: { [key: string]: Feature[] } = {};
  selectAllStates: { [key: string]: boolean } = {};
  Status: { Value: boolean; DisplayName: string }[] = [
    { Value: true, DisplayName: 'Active' },
    { Value: false, DisplayName: 'Deactivated' },
  ];

  isUpdateMode: boolean;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.role = this.route.snapshot.data['role'];

    const featureIds = this.role?.Features?.map(x => x._id) || [];
    const featuresArray: Feature[] = this.route.snapshot.data['features'];
    this.isUpdateMode = !!this.role;
    this.groupedFeatures = featuresArray.reduce((result, currentValue) => {
      (result[currentValue['TagName']] =
        result[currentValue['TagName']] || []).push({
        ...currentValue,
        checked: featureIds.includes(currentValue.Id),
        isShow: true,
      });

      return result;
    }, {});

    // Initialize selectAllStates based on the current groupedFeatures state
    Object.keys(this.groupedFeatures).forEach(key => {
      this.selectAllStates[key] = this.groupedFeatures[key].every(
        feature => feature.checked
      );
    });

    this.roleForm = this.fb.group({
      RoleId: [],
      RoleUniqName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z_]+$/),
          noWhitespaceValidator(),
        ],
      ],
      RoleDisplayName: ['', [Validators.required, Validators.maxLength(100)]],
      Description: ['', [Validators.maxLength(500)]],
      IsActive: [true, Validators.required],
      FeatureIds: [[], !this.isUpdateMode ? [Validators.required] : []],
    });

    if (this.role) {
      if (this.role.Id) this.role.RoleId = this.role.Id;
      this.roleForm.patchValue(this.role);
      this.roleForm.get('RoleUniqName').disable();
    }
  }
  // Method to check if any feature in the group should be shown
  hasVisibleFeatures(keyFeature: string): boolean {
    return this.groupedFeatures[keyFeature].some(feature => feature.isShow);
  }

  // Method for cancel creating new role and navigate to role list page
  cancelCreateRole() {
    this.router.navigate(['roles']);
  }
  // Method for adding new role dialog and send request after confirmation
  submitForm(): void {
    this.roleForm.markAllAsTouched();

    const payload = {
      ...this.roleForm.value,
      ParentRoles: [],
    } as Role;

    let featureIds: string[] = [];
    Object.keys(this.groupedFeatures).forEach((key: string) => {
      const ids = this.groupedFeatures[key]
        ?.filter(feature => feature.checked)
        ?.map(feature => feature.Id);
      featureIds = [...featureIds, ...ids];
    });

    const role: Role = this.route.snapshot.data['role'];
    if (!this.isUpdateMode) {
      payload.FeatureIds = featureIds;
    } else {
      const existingFeatureIds = role.Features?.map(feature => feature._id);

      payload.FeatureIdsToBeAdded = featureIds.filter(
        x => !existingFeatureIds.includes(x)
      );
      payload.FeatureIdsToBeRemoved = existingFeatureIds.filter(
        x => !featureIds?.includes(x)
      );
    }

    if (
      payload.FeatureIdsToBeAdded?.length === 0 &&
      payload.FeatureIdsToBeRemoved?.length === role?.Features?.length
    ) {
      this.waiting = false;
      return;
    }

    if (this.roleForm.valid) {
      const confirmation = this._platformConfirmationService.open({
        title: `Confirm Role ${this.isUpdateMode ? 'Edit' : 'Creation'}`,
        message: `Are you sure you want to ${this.isUpdateMode ? 'edit' : 'create'} this ${!this.isUpdateMode ? 'New' : ''} Role?`,
        actions: {
          confirm: {
            label: `${this.isUpdateMode ? 'Confirm' : 'Create Role'}`,
          },
        },
      });

      confirmation.afterClosed().subscribe(result => {
        if (result) {
          this.waiting = true;

          this.roleService
            .create(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: response => {
                this.waiting = false;
                if (response.Success) {
                  this.router.navigate(['roles']).then();
                }
              },
              error: data => {
                this.waiting = false;
              },
            });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // Method to toggle the checked state of all features in a group
  toggleAllFeatures(keyFeature: string, isChecked: boolean): void {
    this.groupedFeatures[keyFeature].forEach(feature => {
      feature.checked = isChecked;
    });
    this.selectAllStates[keyFeature] = isChecked;

    // set FeatureId Form Values
    this._reCalculateFeatureIds();

    // make the form dirty
    this.roleForm.markAsDirty();
  }
  // Method to check if all features in a group are selected
  checkRootSelection(keyFeature: string): void {
    this.selectAllStates[keyFeature] = this.groupedFeatures[keyFeature].every(
      feature => feature.checked
    );

    // set FeatureId Form Values
    this._reCalculateFeatureIds();

    // make the form dirty
    this.roleForm.markAsDirty();
  }

  _reCalculateFeatureIds() {
    // set FeatureId Form Values
    if (!this.isUpdateMode) {
      let featureIds: string[] = [];
      Object.keys(this.groupedFeatures).forEach((key: string) => {
        const ids = this.groupedFeatures[key]
          ?.filter(feature => feature.checked)
          ?.map(feature => feature.Id);
        featureIds = [...featureIds, ...ids];
      });

      this.roleForm.get('FeatureIds').setValue(featureIds);
    }
  }

  protected readonly Object = Object;
}
