import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'maintenance',
  templateUrl: './release-note.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf],
})
export class ReleaseNoteComponent {
  changelog: any[] = [
    // v19.0.0
    {
      version: 'v1.0.0',
      releaseDate: '28 October 2024',
      changes: [
        {
          type: 'User Access & Role Management',
          list: [
            'SSO-based login.',
            'Role-based permission control (Super Admin, Program Admin, etc.).',
            'View, suspend, and manage user profiles.',
            'Dynamic role creation and permission assignment.',
          ],
        },
        {
          type: 'Group Management',
          list: [
            'Create internal or external recipient groups.',
            'Upload recipient lists via CSV with file validation.',
            'View, edit, delete, and log group activity with audit trails.',
          ],
        },
        {
          type: 'SMS Template Management',
          list: [
            'Create, edit, delete reusable SMS templates.',
            'View edit history and detailed metadata.',
            'Multilingual support for localized templates.',
          ],
        },
        {
          type: 'Campaign Management',
          list: [
            'Create, edit, delete SMS campaigns.',
            'Load from templates or draft campaigns.',
            'Search, filter, and view full campaign logs and recipient lists.',
          ],
        },
        {
          type: 'Workflow Management',
          list: [
            'Build sequential or parallel approval workflows.',
            'Drag-and-drop interface for approval layers.',
            'Add approvers by user or role, reorder steps visually.',
          ],
        },
        {
          type: 'Approval System',
          list: [
            'Multi-level SMS campaign approval with audit trails.',
            'View remarks, recipient list, and SMS details during approval.',
            'Notification system for pending approvals and rejections.',
          ],
        },
        {
          type: 'Dashboard & Reporting',
          list: [
            'Real-time dashboard widgets for balance, usage, success/failure metrics.',
            'Trend charts for campaign performance and approval efficiency.',
            'Exportable reports by date, channel, campaign, etc.',
          ],
        },
        {
          type: 'Notification Engine',
          list: [
            'Notify approvers based on workflow logic (sequential/simultaneous).',
            'Notify initiators upon rejection.',
            'Central notification system tied to campaign lifecycle.',
          ],
        },
        {
          type: 'Improvements & Considerations',
          list: [
            'Seamless UX via integrated Figma-based responsive design.',
            'Scalable permission system across all modules.',
            'Detailed logs for all create/edit/delete actions.',
            'Exception handling for workflow and campaign dependencies.',
          ],
        },
        {
          type: 'Known Limitations',
          list: [
            'No MMS (Multimedia Messaging) support in v1.0.',
            'No Power BI or advanced analytics integration yet.',
            'Third-party application development is out of scope—only registration allowed.',
          ],
        },
        {
          type: 'Documentation',
          list: [
            'SRS Document: Version 1.0 dated 28 October 2024.',
            'UI Prototypes: https://www.figma.com/design/MiEmj9lJU2uJDDWcM4eOq0/App-Modernization-%7C-MySMS---SMS-Broadcasting-Service-Management',
          ],
        },
        {
          type: 'Intended Users',
          list: [
            'Super Admins, Program Admins, Campaign Managers, and Approvers from BRAC’s operational teams.',
          ],
        },
      ],
    },
  ];

  /**
   * Constructor
   */
  constructor() {}
}
