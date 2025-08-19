import { DropdownOptionType } from '@/app/shared/data/type/bep.type';
import { Component, input, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-search-form',
  standalone: true,

  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
  imports: [
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
})
export class SearchFormComponent {
  @Input() IndicatorSearchForm!: FormGroup;
  readonly IndicatorType = input<DropdownOptionType[]>();
  readonly Frequency = input<DropdownOptionType[]>();
}
