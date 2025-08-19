import { SidebarOffsetWidthDirective } from '@/app/shared/directives/sidebar-width.directive';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { TimelineManagementCreateComponent } from '../../components/form/timeline-management-create/timeline-management-create.component';
import { TimelineSetupCommandService } from '../../services/timeline-setup-command.service';
import { PlatformFeatureGuardModule } from '@platform-ui/platform-feature-guard';
import { TIMELINE_SETUP_FEATURES } from '../../data/timeline-setup.constant';

@Component({
  selector: 'app-create-timeline-setup',
  standalone: true,
  imports: [
    CommonModule,
    SidebarOffsetWidthDirective,
    PlatformButtonComponent,
    TranslocoModule,
    MatIcon,
    TimelineManagementCreateComponent,
    PlatformFeatureGuardModule,
  ],
  templateUrl: './create-timeline-setup.component.html',
})
export class CreateTimelineSetupComponent {
  private router = inject(Router);
  @ViewChild(TimelineManagementCreateComponent)
  TimelineManagementFormData: TimelineManagementCreateComponent;
  TIMELINE_SETUP_FEATURES = TIMELINE_SETUP_FEATURES;
  private readonly timelineManagementCommandService = inject(
    TimelineSetupCommandService
  );
  private activatedRoute = inject(ActivatedRoute);
  isLoading = false;
  readonly timalineManagement = signal<any>(
    this.activatedRoute.snapshot.data['timalineManagement']
  );
  public goBack(): void {
    this.router.navigate(['/timeline-management']);
  }
  onCancel(): void {
    this.goBack();
  }
  refreshPage(): void {
    if (this.TimelineManagementFormData?.TargetManagementFrom) {
      this.TimelineManagementFormData.TargetManagementFrom.reset();
    }
  }

  onSubmit() {
    this.isLoading = true;
    const form = this.TimelineManagementFormData?.TargetManagementFrom;

    if (!form || form.invalid) {
      form?.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    const formatBDDateTime = (date: Date | null) => {
      if (!date) return null;

      const now = new Date();

      date.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );
      const offsetMs = date.getTimezoneOffset() * 60 * 1000;
      return new Date(date.getTime() - offsetMs).toISOString();
    };

    const rawValue =
      this.TimelineManagementFormData.TargetManagementFrom.getRawValue();
    console.log('rawValue', rawValue);

    const payload = {
      OperationCategoryId: rawValue.OperationCategoryId,
      InstituteTypeId: rawValue.InstituteTypeId,
      InstituteId:
        rawValue.InstituteList === ''
          ? null
          : Array.isArray(rawValue.InstituteList)
            ? rawValue.InstituteList.join(',')
            : rawValue.InstituteList,
      DivisionId:
        rawValue.DivisionList === '' ? null : rawValue.DivisionList?.Id,
      DistrictId:
        rawValue.DistrictList === '' ? null : rawValue.DistrictList?.Id,
      UpazilaId: rawValue.UpazilaList === '' ? null : rawValue.UpazilaList?.Id,
      Reason: rawValue.Reason === '' ? null : rawValue.Reason,
      StartDate: formatBDDateTime(rawValue.StartDate),
      EndDate: formatBDDateTime(rawValue.EndDate),
      DataCollectionDeadlineInDays: rawValue?.DataCollectionDeadlineInDays,
      DataCollectionFrequencyId: rawValue?.DataCollectionFrequencyId,
      ReportingFrequencyId: rawValue?.ReportingFrequencyId,
      ...(this.TimelineManagementFormData?.isEdit() && {
        timelineId: rawValue?.TimelineId,
      }),
      ...(this.TimelineManagementFormData?.isEdit() && {
        ScheduleId: this.timalineManagement()?.Id,
      }),
    };
    console.log(payload);
    if (this.TimelineManagementFormData?.isEdit()) {
      this.timelineManagementCommandService.Update(payload).subscribe({
        next: res => {
          this.isLoading = false;
          console.log('res', res);
          this.goBack();
        },
        error: err => {
          this.isLoading = false;
          console.error('Update failed:', err);
        },
      });
    } else {
      this.timelineManagementCommandService.Create(payload).subscribe({
        next: res => {
          this.isLoading = false;
          console.log('res', res);
          this.goBack();
        },
        error: err => {
          this.isLoading = false;
          console.error('Update failed:', err);
        },
      });
    }
  }
}
