import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { TranslocoDirective } from '@ngneat/transloco';
import { ProfileFieldCardComponent } from '@/app/modules/uam/users/components/details/user-profile/user-field-card';
import { MatChip, MatChipListbox } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CopyToClipboardComponent } from '@/app/shared/components/copy-to-clipboard.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    TranslocoDirective,
    ProfileFieldCardComponent,
    MatChip,
    MatChipListbox,
    MatTooltipModule,
    CopyToClipboardComponent,
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);

  data = input<User>(this.route.parent?.snapshot.data['user']);
  isQuickView = input<boolean>(false);

  _unsubscribeAll$ = new Subject();

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscribeAll$.next(false);
    this._unsubscribeAll$.complete();
  }
}
