import { ResolveFn, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@/app/modules/uam/users/user.service';
import { UserDataService } from '@platform-ui/platform-core/services';
import { ProfileDetailsDialogComponent } from '@/app/modules/uam/profile/profile-details-dialog/profile-details-dialog.component';
import { of, switchMap } from 'rxjs';
import { User } from '@/app/modules/uam/users/data/types/user.type';
import { StaffService } from '@/app/modules/uam/stuff/staff.service';
import { map } from 'rxjs/operators';

export const profileDetailsResolver: ResolveFn<unknown> = route => {
  const userData = inject(UserDataService).getUserData();
  const staffService = inject(StaffService);

  let id = route.params['id'];
  if (!id) {
    id = userData?.UserId;
  }

  return inject(UserService)
    .getById(id)
    .pipe(
      switchMap((user: User) => {
        // if no user profile found, then get data from staff table
        if (!user && !route.params['id']) {
          return staffService.getStaffAsUser(userData?.UserName).pipe(
            map(staff => {
              if (!staff) {
                return {
                  UserName: userData?.UserName,
                  FirstName: userData?.FirstName,
                  LastName: userData?.LastName,
                  Email: userData?.Email,
                  DemarcationId: userData?.DemarcationId,
                } as User;
              }

              return staff;
            })
          );
        }

        return of(user);
      })
    );
};

export default [
  {
    path: '',
    component: ProfileDetailsDialogComponent,
    data: { breadcrumb: 'My Profile' },
    resolve: {
      user: profileDetailsResolver,
    },
  },
] as Routes;
