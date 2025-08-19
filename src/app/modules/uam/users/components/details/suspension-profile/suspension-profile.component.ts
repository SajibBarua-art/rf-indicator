import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { MatDivider } from '@angular/material/divider';
import { Subject, take, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective, TranslocoModule } from '@ngneat/transloco';
import { UserService } from '../../../user.service';

@Component({
  selector: 'app-suspension-profile',
  templateUrl: './suspension-profile.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PlatformButtonComponent,
    MatDivider,
    MatIconModule,
    TranslocoModule,
  ],
})
export class SuspensionProfileComponent {
  isSaving = false;
  userForm: FormGroup;
  combinedData: any[] = [];
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<SuspensionProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.userForm = this.formBuilder.group({
      UserId: [data.Id, Validators.required],
      Remark: ['', data.UserStatusId === 0 ? Validators.required : []],
    });
    if (data.UserStatusId === 0) {
      this.loadApprovers(data.Id);
    }
  }

  submitForm() {
    if (this.userForm.valid) {
      this.isSaving = true;
      const payload = this.userForm.value;
      let suspendUser$ = this.userService.suspendUser(payload);
      if (this.data.UserStatusId === 1) {
        suspendUser$ = this.userService.activateUser(this.data?.Id);
      }
      suspendUser$.pipe(takeUntil(this.unsubscribe$), take(1)).subscribe({
        next: commandSuccess => {
          this.isSaving = false;
          if (commandSuccess.Success) {
            this.dialogRef.close(true);
          }
        },
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  private loadApprovers(userId: string) {
    this.userService.getApproversByUserId(userId).subscribe(
      (steps: any[]) => {
        if (steps && Array.isArray(steps)) {
          const approvalFlowIds: string[] = (steps as any[]).map(
            step => step.ApprovalFlowId
          );

          console.log('ApprovalFlowIds:', approvalFlowIds);

          this.fetchWorkflowNames(approvalFlowIds, steps);
        }
      },
      error => {
        console.error('Error fetching approvers:', error);
      }
    );
  }

  private fetchWorkflowNames(approvalFlowIds: string[], steps: any[]): void {
    this.userService
      .getWorkflowNameByApprovalFlowId(approvalFlowIds)
      .subscribe(response => {
        const workflowMap = response.reduce((map, workflow) => {
          map[workflow.ApprovalFlowId] = workflow.ApprovalFlowName;
          return map;
        }, {});

        // Combine steps with the corresponding ApprovalFlowName
        this.combinedData = steps.map((step: any) => {
          const approvalFlowName =
            workflowMap[step.ApprovalFlowId] || 'Unknown Workflow';
          return {
            StepName: step.StepName,
            ApprovalFlowName: approvalFlowName,
          };
        });
      });
  }
}
