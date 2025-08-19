import { MatChipsModule } from '@angular/material/chips';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { CardComponent } from '@/app/shared/components/card/card.component';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatChipsModule,
    CardComponent,
    PlatformButtonComponent,
  ],
})
export class UserFormComponent implements OnInit {
  @Input() set userData(user: User) {
    if (this?.userForm) {
      user.UserId = user.Id;
      this.userForm.patchValue(user);
    }
  } // Input property to receive user data
  @Input() isEditMode: boolean = false; // Input property to check if the form is in edit mode
  @Output() formSubmit = new EventEmitter<unknown>(); // Output event emitter to notify parent component on form submission

  userForm: FormGroup; // Form group to handle user form
  rolesList: string[] = ['Admin', 'User', 'Manager']; // List of roles
  profilePic: string | ArrayBuffer | null = null; // Variable to store profile picture
  isChecked: boolean = true; // Variable to manage status toggle
  rolesCtrl = this.formBuilder.control('', Validators.required); // Form control for roles with validation

  // Key codes for Enter and Comma
  separatorKeysCodes: number[] = [13, 188];
  filteredRoles: Observable<string[]>; // Observable to handle filtered roles for autocomplete

  constructor(private formBuilder: FormBuilder) {
    // Initialize user form with required validators
    this.userForm = this.formBuilder.group({
      UserId: [''],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', Validators.required],
      UserRoles: [[]],
      Active: [false],
      ProfileImageId: [null],
    });

    // Initialize filtered roles observable
    this.filteredRoles = this.rolesCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterRoles(value))
    );
  }

  ngOnInit(): void {
    // If userData is provided, patch the form with the user data
    if (this.userData) {
      this.isChecked = this.userData.UserStatusId === 1;
      this.userForm.patchValue(this.userData);
      this.profilePic = this.userData.ProfileImageId;
    }
  }

  // Method to filter roles based on user input
  private filterRoles(value: string | null): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.rolesList.filter(role =>
      role.toLowerCase().includes(filterValue)
    );
  }

  // Method to submit the form data
  submitForm(): void {
    if (this.userForm.valid) {
      const formData = {
        ...this.userForm.value,
        profilePic: this.profilePic,
      };
      formData.status = formData.status ? 'Active' : 'Inactive'; // Assign 'Active' or 'Inactive' based on status toggle
      this.formSubmit.emit(formData); // Emit form data to parent component
    }
  }
}
