import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { RFIndicatorCommandPayload } from '@/app/modules/rf-indicator/data/rf-indicator.type';
import { ActivatedRoute } from '@angular/router';
import { RfIndicatorQueryService } from '@/app/modules/rf-indicator/services/rf-indicator-query.service';
import { systemData } from '../../data/indicator-breakdown.constant';
import { PlatformConfirmationService } from '@platform-ui/platform-bootstrap-template';

@Component({
  selector: 'app-breakdown-form',
  standalone: true,
  templateUrl: './breakdown-form.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
})
export class BreakdownFormComponent implements OnInit {
  @Input() breakdownform!: FormGroup;
  breakdownLabel: number = 0;
  IndicatorNumber: number = 0;
  @Input() RfIndicatorData: RFIndicatorCommandPayload;
  private RfIndicatorQueryService = inject(RfIndicatorQueryService);
  isLayerExpanded: boolean[] = [];
  System: { label: string; value: string }[];
  SourceType: { value: number; label: string }[] = [
    { value: 1, label: 'System' },
    { value: 2, label: 'Manual Input' },
  ];
  private _platformConfirmationService = inject(PlatformConfirmationService);
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    this.RfIndicatorQueryService.getById(id).subscribe({
      next: (response: RFIndicatorCommandPayload) => {
        this.RfIndicatorData = response;
        this.breakdownLabel = response.BreakdownLayer;
        this.IndicatorNumber = response.IndicatorNumber;
        console.log('Indicator Number:', this.RfIndicatorData.IndicatorNumber);

        console.log('RfIndicatorData', this.RfIndicatorData);

        this.initializeLayers();
      },
      error: error => {
        console.error('Error fetching data:', error);
      },
    });
  }

  ngOnInit() {
    console.log('this.layers.length', this.breakdownform);
    this.System = systemData.map(system => ({
      label: system.name,
      value: system.value,
    }));
    if (!this.breakdownform.get('layers')) {
      this.breakdownform.addControl('layers', this.fb.array([]));
      this.initializeLayers();
    } else if (this.layers.length === 0 && this.breakdownLabel > 0) {
      this.initializeLayers();
    }
  }

  initializeLayers() {
    console.log('this.layers', this.layers.getRawValue());

    // Only initialize if layers are empty or don't exist
    if (this.layers.length === 0) {
      console.log('this.breakdownform', this.breakdownform);

      for (let i = 0; i < this.breakdownLabel; i++) {
        const layerGroup = this.fb.group({
          breakdowns: this.fb.array([this.createBreakdownItem(i, 1)]),
        });
        this.layers.push(layerGroup);
      }
    } else {
      // If layers already exist, just ensure we have the correct number of layers
      // and preserve existing breakdown data
      const currentLayers = this.layers.getRawValue();
      console.log('Preserving existing layers:', currentLayers);

      // If we need more layers, add them
      while (this.layers.length < this.breakdownLabel) {
        const newLayerIndex = this.layers.length;
        const layerGroup = this.fb.group({
          breakdowns: this.fb.array([
            this.createBreakdownItem(newLayerIndex, 1),
          ]),
        });
        this.layers.push(layerGroup);
      }

      // If we have too many layers, remove the extra ones
      while (this.layers.length > this.breakdownLabel) {
        this.layers.removeAt(this.layers.length - 1);
      }
    }
    this.isLayerExpanded = Array(this.layers.length).fill(true);
  }

  getLayerArray(): number[] {
    return Array(this.breakdownLabel).fill(0);
  }

  get layers(): FormArray {
    return this.breakdownform.get('layers') as FormArray;
  }
  toggleLayer(index: number) {
    this.isLayerExpanded[index] = !this.isLayerExpanded[index];
  }
  getBreakdowns(layerIndex: number): FormArray {
    return this.layers.at(layerIndex).get('breakdowns') as FormArray;
  }

  addLabel(layerIndex: number): void {
    const breakdowns = this.getBreakdowns(layerIndex);
    const nextSequence = breakdowns.length + 1;
    breakdowns.push(this.createBreakdownItem(layerIndex, nextSequence));

    this.recalculateChildLayers(layerIndex);
  }

  removeLabel(layerIndex: number, breakdownIndex: number): void {
    const confirmation = this._platformConfirmationService.open({
      title: 'Delete Indicator',
      message: 'Are you sure you want to delete this Indicator?',
      actions: {
        cancel: { label: 'No' },
        confirm: { label: 'Yes, Delete' },
      },
    });

    confirmation.afterClosed().subscribe(result => {
      if (result) {
        const breakdowns = this.getBreakdowns(layerIndex);
        if (breakdowns.length > 1) {
          breakdowns.removeAt(breakdownIndex);

          this.recalculateIndicatorNumbers(layerIndex);

          this.recalculateChildLayers(layerIndex);
        }
      }
    });
  }

  private createBreakdownItem(layerIndex: number, sequence: number): FormGroup {
    const indicatorNumber = this.generateIndicatorNumber(layerIndex, sequence);

    const breakdownItem = this.fb.group({
      IndicatorNumber: [indicatorNumber, Validators.required],
      IndicatorStatement: ['', Validators.required],
      System: [''],
      SourceType: ['', Validators.required],
    });

    // Watch for changes in SourceType to conditionally set System as required
    breakdownItem.get('SourceType')?.valueChanges.subscribe(sourceType => {
      const systemControl = breakdownItem.get('System');
      console.log('SourceType', sourceType);

      if (Number(sourceType) === 1) {
        systemControl?.setValidators([Validators.required]);
      } else {
        systemControl?.clearValidators();
      }
      systemControl?.updateValueAndValidity({ emitEvent: false });
    });

    return breakdownItem;
  }

  private generateIndicatorNumber(
    layerIndex: number,
    sequence: number
  ): string {
    if (layerIndex === 0) {
      return `${this.IndicatorNumber}.${sequence}`;
    }

    let baseNumber = this.IndicatorNumber.toString();

    for (let i = 0; i < layerIndex; i++) {
      const parentBreakdowns = this.getBreakdowns(i);
      if (parentBreakdowns.length > 0) {
        baseNumber += '.1';
      }
    }

    baseNumber += `.${sequence}`;

    return baseNumber;
  }

  private recalculateIndicatorNumbers(layerIndex: number): void {
    const breakdowns = this.getBreakdowns(layerIndex);
    breakdowns.controls.forEach((control, index) => {
      const newIndicatorNumber = this.generateIndicatorNumber(
        layerIndex,
        index + 1
      );
      control.get('IndicatorNumber')?.setValue(newIndicatorNumber);
    });
  }

  private recalculateChildLayers(parentLayerIndex: number): void {
    for (let i = parentLayerIndex + 1; i < this.layers.length; i++) {
      this.recalculateIndicatorNumbers(i);
    }
  }

  getIndicatorNumber(layerIndex: number, breakdownIndex: number): string {
    const breakdowns = this.getBreakdowns(layerIndex);
    const control = breakdowns.at(breakdownIndex);
    return control.get('IndicatorNumber')?.value || '';
  }
}
