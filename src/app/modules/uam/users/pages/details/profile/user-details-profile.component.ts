import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { Subject, takeUntil } from 'rxjs';
import { UserProfileComponent } from '@/app/modules/uam/users/components/details/user-profile/user-profile.component';

@Component({
  selector: 'app-user-details-profile',
  template: `<app-user-profile [data]="data()"></app-user-profile>`,
  standalone: true,
  imports: [UserProfileComponent],
  encapsulation: ViewEncapsulation.None,
})
export class UserDetailsProfileComponent implements OnInit, OnDestroy {
  data = signal<User>(null);
  isQuickView = input<boolean>(false);
  _unsubscribeAll$ = new Subject();

  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.parent?.data
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe(data => {
        this.data.set(data['user']);
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next(false);
    this._unsubscribeAll$.complete();
  }
}
