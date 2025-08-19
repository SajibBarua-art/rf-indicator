import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom, Subject } from 'rxjs';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import Quill from 'quill';
import ImageUploader from 'quill-image-uploader';
import BlotFormatter from 'quill-blot-formatter';
import { FileUploaderPublicService } from '@/app/shared/components/quill-editor-form-control/file-uploader-public.service';

// Register Quill modules only once outside the component class.
// This prevents re-registering on every component instance.
Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-quill-editor-form-control',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    QuillModule,
    QuillEditorComponent,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorFormControlComponent),
      multi: true,
    },
  ],
  template: `
    <quill-editor
      class="mt-2"
      [bounds]="'self'"
      [modules]="quillModules"
      [(ngModel)]="editorData"
      (ngModelChange)="onModelChange($event)"
      [readOnly]="isDisabled"></quill-editor>
    @if (hasError()) {
      <div class="text-sm text-red-600 mt-1">
        {{ getErrorMessage() }}
      </div>
    }
  `,
})
export class QuillEditorFormControlComponent
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  private readonly uploadService = inject(FileUploaderPublicService);
  private ngControl: NgControl | null = null;
  private readonly injector = inject(Injector); // Inject Injector directly

  editorData: any;
  isDisabled: boolean = false; // New property to track disabled state

  quillModules: any; // Initialize in ngOnInit or constructor to use 'this'

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Initialize quillModules here to allow access to 'this' for uploadService
    this.quillModules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ script: 'sub' }, { script: 'super' }],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        [{ direction: 'rtl' }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image'],
      ],
      blotFormatter: {},
      imageUploader: {
        upload: (file: File) => {
          return firstValueFrom(this.uploadService.uploadImage(file, true));
        },
      },
    };
  }

  ngAfterViewInit(): void {
    // Lazy resolve to avoid circular dependency
    // Use the injected injector
    Promise.resolve().then(() => {
      this.ngControl = this.injector.get(NgControl, null);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ ControlValueAccessor methods
  // -----------------------------------------------------------------------------------------------------

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.editorData = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Called when the form control's disabled state changes.
   * @param isDisabled Whether the control is disabled.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled; // Update the property bound to [readOnly]
  }

  onModelChange(value: any): void {
    this.editorData = value;
    this.onChange(value); // Notify Angular forms
    this.onTouched();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public / Helper methods
  // -----------------------------------------------------------------------------------------------------

  hasError(): boolean {
    return (
      !!this.ngControl?.control?.invalid &&
      (this.ngControl?.control?.touched || this.ngControl?.control?.dirty)
    );
  }

  getErrorMessage(): string {
    const errors = this.ngControl?.control?.errors;

    if (!errors) return '';

    if (errors['required']) return 'This field is required.';
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} characters required.`;
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed.`;

    // Add more specific error messages as needed
    return 'Invalid input.';
  }

  /**
   * Track by function for ngFor loops (though not directly used in the provided template)
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
