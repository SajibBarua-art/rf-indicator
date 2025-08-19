import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  SimpleChanges,
  OnChanges,
  DOCUMENT,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appPaginatorWithPageNumbers]',
  standalone: true,
})
export class PaginatorWithPageNumbersDirective
  implements AfterViewInit, OnDestroy, OnChanges
{
  @Input() maxVisiblePages = 5;
  @Input() length: number = 0;
  private hasInitialized = false;

  private paginatorEl: HTMLElement | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private paginator: MatPaginator,
    private el: ElementRef,
    @Optional() @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.hasInitialized && changes['length'] && this.length > 0) {
      this.setupPageNumbers();
      this.hasInitialized = true;
    }
  }

  ngAfterViewInit(): void {
    this.paginatorEl = this.el.nativeElement;
    setTimeout(() => this.setupPageNumbers(), 0);

    this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => this.setupPageNumbers(), 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupPageNumbers(): void {
    if (!this.paginatorEl) return;

    const rangeActions = this.paginatorEl.querySelector(
      '.mat-mdc-paginator-range-actions'
    );
    if (!rangeActions) return;

    const existingContainer = this.paginatorEl.querySelector(
      '.page-number-container'
    );
    if (existingContainer) {
      existingContainer.remove();
    }

    const pageNumberContainer = this.document.createElement('div');
    pageNumberContainer.className = 'page-number-container';
    pageNumberContainer.style.display = 'flex';
    pageNumberContainer.style.alignItems = 'center';
    pageNumberContainer.style.marginRight = '16px';

    const pageNumbers = this.getDisplayedPageNumbers();

    console.log('pageNumbers', pageNumbers);
    pageNumbers.forEach(pageIndex => {
      if (pageIndex === -1) {
        const ellipsis = this.document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.margin = '0 4px';
        pageNumberContainer.appendChild(ellipsis);
      } else {
        const button = this.document.createElement('button');
        button.textContent = (pageIndex + 1).toString();
        button.className = 'page-number-button';
        button.style.minWidth = '32px';
        button.style.height = '32px';
        button.style.padding = '0';
        button.style.margin = '0 2px';
        button.style.borderRadius = '4px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.backgroundColor =
          pageIndex === this.paginator.pageIndex ? '#e0e0e0' : 'transparent';

        button.addEventListener('click', () => {
          this.paginator.pageIndex = pageIndex;
          this.paginator.page.emit({
            pageIndex,
            pageSize: this.paginator.pageSize,
            length: this.paginator.length,
          });
        });

        pageNumberContainer.appendChild(button);
      }
    });

    const nextButton = this.paginatorEl.querySelector(
      '.mat-mdc-paginator-navigation-next'
    );
    if (nextButton && rangeActions) {
      rangeActions.insertBefore(pageNumberContainer, nextButton);
    }
  }

  private getDisplayedPageNumbers(): number[] {
    const totalPages = Math.ceil(
      this.paginator.length / this.paginator.pageSize
    );
    const currentPage = this.paginator.pageIndex;
    const result: number[] = [];

    if (totalPages <= this.maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        result.push(i);
      }
    } else {
      result.push(0);

      let startPage = Math.max(1, currentPage - (this.maxVisiblePages - 1) / 2);
      let endPage = Math.min(
        totalPages - 2,
        currentPage + (this.maxVisiblePages - 1) / 2
      );

      if (startPage > 1) {
        result.push(-1);
      }

      for (let i = startPage; i <= endPage; i++) {
        result.push(i);
      }

      if (endPage < totalPages - 2) {
        result.push(-1);
      }

      if (totalPages > 1) {
        result.push(totalPages - 1);
      }
    }

    return result;
  }
}
