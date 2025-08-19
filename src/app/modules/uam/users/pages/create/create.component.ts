import { Component, inject, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@platform-ui/platform-bootstrap-template/@fuse';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormComponent } from '@/app/modules/uam/users/components/user-form/user-form.component';
import { UserService } from '../../user.service';
import { User } from '@/app/modules/uam/users/data/types/user.type';

@Component({
  selector: 'app-users-create',
  templateUrl: './create.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  imports: [UserFormComponent],
})
export class CreateUserComponent {
  public userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public data = this.route.snapshot.data?.data?.at(0) as User;

  /**
   * Constructor
   */
  constructor() {}

  handleSubmit(formData: any) {
    try {
      this.userService.create(formData).subscribe(isSuccess => {
        if (isSuccess) {
          this.router.navigate(['users']).then();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
