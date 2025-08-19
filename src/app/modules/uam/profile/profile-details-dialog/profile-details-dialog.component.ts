import { Component, inject, signal } from '@angular/core';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { TranslocoDirective } from '@ngneat/transloco';
import { PlatformCardComponent } from '@platform-ui/platform-bootstrap-template';
import { ActivatedRoute } from '@angular/router';
import { UserProfileComponent } from '@/app/modules/uam/users/components/details/user-profile/user-profile.component';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details-dialog.component.html',
  imports: [TranslocoDirective, PlatformCardComponent, UserProfileComponent],
})
export class ProfileDetailsDialogComponent {
  route = inject(ActivatedRoute);

  data = signal<User>(this.route.snapshot.data['user']);

  constructor() {
    this.data.set(this.route.snapshot.data['user']);
  }
}
