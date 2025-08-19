import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@/app/modules/uam/roles/data/types/role.type';

@Component({
  selector: 'app-role-recipients',
  templateUrl: './role-recipients.component.html',
  imports: [PlatformAdvanceDatatableModule],
})
export class RoleRecipientsComponent implements OnInit, AfterViewInit {
  datatableConfig = signal<PlatformAdvanceDatatableOptions>(null);
  route = inject(ActivatedRoute);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log('init UamComponent');
  }

  ngAfterViewInit(): void {
    const role = this.route.parent.snapshot.data['role'] as Role;
    const pinNumbers = role.PinNumbers?.map(x => `'${x}'`)?.join(',') || '';

    this.datatableConfig.set({
      TableConfigId: 'role-recipients-table',
      CustomFilterQuery: `{PinNumber: { $in: [${pinNumbers}] }}`,
    });
  }
}
