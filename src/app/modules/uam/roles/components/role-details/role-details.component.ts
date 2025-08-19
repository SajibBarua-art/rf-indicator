import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { Role } from '@/app/modules/uam/roles/data/types/role.type';
import { ProfileFieldCardComponent } from '@/app/modules/uam/users/components/details/user-profile/user-field-card';
import { TranslocoDirective } from '@ngneat/transloco';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatDividerModule,
    ProfileFieldCardComponent,
    TranslocoDirective,
  ],
})
export class RoleDetailsComponent implements OnInit {
  @Input() role: Role;
  @Input() showPermissions: boolean = true;
  @Input() isQuickView = false;

  protected readonly Object = Object;
  groupedFeatures: { [key: string]: any[] } = {};

  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      if (data['role']) {
        this.role = data['role'];
        this.showPermissions = true;
      }
      this.groupedFeatures =
        this.role?.Features?.reduce((result, feature) => {
          (result[feature.TagName] = result[feature.TagName] || []).push(
            feature
          );
          return result;
        }, {}) || [];
    });
  }
}
