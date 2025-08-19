import { RFIndicatorViewModel } from '@/app/modules/rf-indicator/data/rf-indicator.type';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import {
  PlatformAdvanceDatatableModule,
  PlatformAdvanceDatatableOptions,
} from '@platform-ui/platform-advance-datatable';
import { PlatformButtonComponent } from '@platform-ui/platform-bootstrap-template';
import { Subject } from 'rxjs';
import { INDICATOR_BREAKDOWN_TABLES } from '../../data/indicator-breakdown.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-indicator-breakdown-list',
  standalone: true,

  templateUrl: './indicator-breakdown-list.component.html',
  styleUrl: './indicator-breakdown-list.component.scss',
  imports: [
    TranslocoModule,
    PlatformButtonComponent,
    PlatformAdvanceDatatableModule,
    SearchFormComponent,
    MatIconModule,
  ],
})
export class IndicatorBreakdownListComponent {
  Title: string = '';
  private _router = inject(Router);
  public initialPage$ = new Subject<number>();
  datatableConfig = signal<PlatformAdvanceDatatableOptions>({
    TableConfigId: INDICATOR_BREAKDOWN_TABLES.List,
  });
  public currentPageNumber: number = 0;
  isTableVisible = true;

  sideBarAction($event: {
    Action: { SidebarName: string };
    RowData: RFIndicatorViewModel;
  }): void {
    this.goToView($event.RowData.Id);
  }
  IndicatorType() {}
  Frequency() {}

  search() {
    this._router.navigate(['rf-indicator', 'create']);
  }

  goToView(id: string) {
    this._router.navigate(['rf-indicator', 'view', id]);
  }

  reloadTable() {
    this.initialPage$.next(this.currentPageNumber);
  }

  refreshTable() {
    this.isTableVisible = false;

    setTimeout(() => {
      this.isTableVisible = true;
    }, 0);
  }
}
