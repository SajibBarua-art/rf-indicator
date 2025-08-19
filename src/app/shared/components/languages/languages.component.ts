import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';

@Component({
  selector: 'languages',
  templateUrl: './languages.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'languages',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatSlideToggleModule,
    FormsModule,
    NgClass,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  host: { hostID: crypto.randomUUID().toString() },
})
export class LanguagesComponent implements OnInit, OnDestroy {
  availableLangs: AvailableLangs;
  activeLang: string;
  flagCodes: any;

  @ViewChild('darkModeSwitch', { read: ElementRef }) element:
    | ElementRef
    | undefined;

  /**
   * Constructor
   */
  constructor(private _translocoService: TranslocoService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the available languages from transloco
    this.availableLangs = this._translocoService.getAvailableLangs();

    // Subscribe to language changes
    this._translocoService.langChanges$.subscribe(activeLang => {
      // Get the active lang
      this.activeLang = activeLang;
    });

    // Set the country iso codes for languages for flags
    this.flagCodes = {
      en: 'en',
      bd: 'bd',
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set the active lang
   *
   * @param lang
   */
  setActiveLang(selectedLang: any): void {
    const lang = selectedLang.value;
    localStorage.setItem('lang', lang);
    this._translocoService.setActiveLang(lang);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {}
}
