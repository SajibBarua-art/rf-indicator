import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  signal,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { SidebarOffsetWidthDirective } from '@/app/shared/directives/sidebar-width.directive';
import { MatIcon } from '@angular/material/icon';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { TranslocoModule } from '@ngneat/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { RFIndicatorCommandPayload } from '@/app/modules/rf-indicator/data/rf-indicator.type';
import { CreateRFIndicatorFormComponent } from '@/app/modules/rf-indicator/components/form/create-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RfIndicatorCommandService } from '../../services/rf-indicator-command.services';
import { UtilityService } from '@platform-ui/platform-core/services';

@Component({
  selector: 'app-create-rf-indicator',
  standalone: true,
  imports: [
    CommonModule,
    SidebarOffsetWidthDirective,
    PlatformButtonComponent,
    TranslocoModule,
    MatIcon,
    CreateRFIndicatorFormComponent,
  ],
  templateUrl: './create-rf-indicator.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CreateRfIndicatorComponent implements OnInit {
  @Input() RfIndicatorform: FormGroup;
  @Input() indicator: RFIndicatorCommandPayload | null = null;
  IndicatorTypeId: [number, string] = [0, ''];

  IndicatorNumber: string = '';
  Title: string = '';
  BreakdownLayer: string = '';
  DataNatureId: number = 0;
  DataCollectionFrequencyId: number = 0;
  private readonly fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  readonly isLoading = signal(false);
  private readonly utilityService = inject(UtilityService);
  readonly isEdit = computed(() => !!this.activatedRoute.snapshot.params['id']);
  private RfIndicatorCommandService = inject(RfIndicatorCommandService);
  readonly rfIndicator = signal<RFIndicatorCommandPayload>(
    this.activatedRoute.snapshot.data['rfIndicator']
  );

  readonly isView = computed(
    () => !!this.activatedRoute.snapshot.data['isView']
  );

  readonly confirmMessage = signal(
    'Are you sure you want to save this "RF Indicator"?'
  );
  ngOnInit() {
    this.indicator = this.activatedRoute.snapshot.data['rfIndicator'] || null;

    this.RfIndicatorform = this.fb.group({
      IndicatorTypeId: ['', Validators.required],
      IndicatorNumber: ['', Validators.required],
      Title: ['', [Validators.required, Validators.maxLength(150)]],
      BreakdownLayer: ['', Validators.required],
      DataNatureId: ['', Validators.required],
      DataCollectionFrequencyId: ['', Validators.required],
    });

    if (this.isEdit()) {
      this.RfIndicatorform.get('IndicatorNumber')?.disable();

      const indicator = this.rfIndicator();
      if (indicator) {
        this.RfIndicatorform.patchValue({
          IndicatorId: indicator.Id,
          IndicatorTypeId: indicator.IndicatorType.Value,
          IndicatorNumber: indicator.IndicatorNumber,
          Title: indicator.Title,
          BreakdownLayer: indicator.BreakdownLayer,
          DataNatureId: indicator.DataNature.Value,
          DataCollectionFrequencyId: indicator.DataCollectionFrequency.Value,
        });
      }
    }
  }

  refreshPage(): void {
    if (this.isEdit() && this.indicator) {
      this.RfIndicatorform.reset({
        IndicatorTypeId: this.indicator.IndicatorType.Value,
        IndicatorNumber: this.indicator.IndicatorNumber,
        Title: this.indicator.Title,
        BreakdownLayer: this.indicator.BreakdownLayer,
        DataNatureId: this.indicator.DataNature.Value,
        DataCollectionFrequencyId: this.indicator.DataCollectionFrequency.Value,
      });
    } else {
      this.RfIndicatorform.reset();
    }
  }

  public goBack(): void {
    this.router.navigate(['/rf-indicator']);
  }

  onCancel(): void {
    this.goBack();
  }

  public submitForm(): void {
    if (this.RfIndicatorform.invalid) {
      this.RfIndicatorform.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const commandPayload = {
      IndicatorTypeId: this.RfIndicatorform?.value?.IndicatorTypeId,
      IndicatorNumber: this.RfIndicatorform?.value?.IndicatorNumber,
      Title: this.RfIndicatorform?.value?.Title,
      BreakdownLayer: this.RfIndicatorform?.value?.BreakdownLayer,
      DataNatureId: this.RfIndicatorform?.value?.DataNatureId,
      DataCollectionFrequencyId:
        this.RfIndicatorform?.value?.DataCollectionFrequencyId,
      IndicatorId: this.isEdit()
        ? this.rfIndicator()?.Id
        : this.utilityService.getNewGuid(),
    };
    console.log('Command Payload:', commandPayload);

    const request = this.isEdit()
      ? this.RfIndicatorCommandService.Update(commandPayload)
      : this.RfIndicatorCommandService.Create(commandPayload);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.goBack();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
