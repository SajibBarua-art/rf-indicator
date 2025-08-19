import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]',
  standalone: true,
})
export class RestrictInputDirective {
  private regex: RegExp = new RegExp(/^[a-zA-Z_]*$/);

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!this.regex.test(value)) {
      // Only keep characters that match the regex pattern
      input.value = value.replace(/[^a-zA-Z_]/g, '');
      // Trigger input event to update form control value
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  }
}
