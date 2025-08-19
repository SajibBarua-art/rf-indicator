import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  input,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { RFIndicatorViewModel } from '@/app/modules/rf-indicator/data/rf-indicator.type';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import {
  DATA_FREQUENCIES,
  DATA_NATURE_OPTIONS,
  INDICATOR_TYPES,
} from '../../data/rf-indicator.constant';

@Component({
  selector: 'app-create-rf-indicator-form',
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    TranslocoModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatRadioButton,
    MatRadioButton,
    MatRadioModule,
  ],
})
export class CreateRFIndicatorFormComponent {
  @Input() rfIndicator: RFIndicatorViewModel | null = null;
  @Input() RfIndicatorform: FormGroup;
  @Input() isEdit: boolean = false;
  @Input() IndicatorTypeId: [number, string] = [0, ''];

  @Input() IndicatorNumber: number = 0;
  @Input() Title: string = '';
  @Input() BreakdownLayer: number = 0;
  @Input() DataNatureId: number = 0;
  @Input() DataCollectionFrequencyId: number = 0;
  isView = input(false);

  indicatorTypes = INDICATOR_TYPES;
  dataNatureOptions = DATA_NATURE_OPTIONS;
  dataFrequencies = DATA_FREQUENCIES;

  constructor() {
    effect(() => {
      // effect
    });
  }
}
