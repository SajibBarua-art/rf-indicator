import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DATA_FREQUENCIES } from '@/app/modules/rf-indicator/data/rf-indicator.constant';
import { BreakdownFormComponent } from '../breakdown-form/breakdown-form.component';
import { DropdownOptionType } from '@/app/shared/data/type/bep.type';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.css',
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
    BreakdownFormComponent,
  ],
})
export class EditFormComponent {
  @Input() IndicatorEditForm!: FormGroup;
  @Input() breakdownform!: FormGroup;
  @Input() OperationCategories: { value: number; label: string }[] = [];
  @Input() InstituteTypes: { value: number; label: string }[] = [];
  @Input() System: { value: number; label: string }[] = [];
  @Input() regionOptions;
  @Input() areaOptions;
  @Input() DivisionList: DropdownOptionType[] = [];
  @Input() DistrictList: DropdownOptionType[] = [];
  @Input() UpazilaList: DropdownOptionType[] = [];
  @Input() UserRoleMaker: { value: string; label: string }[] = [];
  @Input() UserRoleChecker: { value: string; label: string }[] = [];
  @Input() ValidatorField: { value: string; label: string }[] = [];
  @Input() ValidatorHo: { value: string; label: string }[] = [];
  @Input() Upazila: string[] = [];

  dataFrequencies = DATA_FREQUENCIES;

  @Input() divisionToDistrictMap!: { [key: string]: string[] };
  @Input() districtToUpazilaMap!: { [key: string]: string[] };
  ngOnInit(): void {
    console.log('this.', this.OperationCategories);
  }
  compareUserRole = (a: any, b: any): boolean => {
    return a?.value === b?.value;
  };
  onDivisionListChange() {
    const selectedDivisions =
      this.IndicatorEditForm.get('DivisionList')?.value || [];
    console.log('selectedDivisions', selectedDivisions);
  }

  OnDivisionSelect(isChecked: boolean) {
    const divisionControl = this.IndicatorEditForm.get('DivisionList');

    console.log('divisionControl', divisionControl);

    console.log('this.DivisionList', this.DivisionList);

    if (isChecked) {
      const allDivisionIds = this.DivisionList.map(d => d.Value);
      console.log('allDivisionIds', allDivisionIds);

      divisionControl?.setValue(allDivisionIds);
    } else {
      divisionControl?.setValue([]);
    }
  }

  OnDistrictSelect(isChecked: boolean) {
    const districtControl = this.IndicatorEditForm.get('DistrictList');
    console.log('this.DistrictList', this.DistrictList);
    if (isChecked) {
      const allDistrictIds = this.DistrictList.map(d => d.Value);
      districtControl?.setValue(allDistrictIds);
    } else {
      districtControl?.setValue([]);
    }
  }

  onDistrictListChange() {
    console.log(
      "this.IndicatorEditForm.get('DistrictList')?.value",
      this.IndicatorEditForm.get('DistrictList')?.value
    );

    const selectedDistricts =
      this.IndicatorEditForm.get('DistrictList')?.value || [];
    console.log('selectedDistricts', selectedDistricts);
  }

  OnUpazilaSelect(isChecked: boolean) {
    const upazilaControl = this.IndicatorEditForm.get('UpazilaList');
    console.log('this.UpazilaList', this.UpazilaList);

    if (isChecked) {
      console.log('hello');

      const allUpazilaIds = this.UpazilaList.map(u => u.Value);
      console.log('allUpazilaIds', allUpazilaIds);

      upazilaControl?.setValue(allUpazilaIds);
    } else {
      upazilaControl?.setValue([]);
    }
  }
}
