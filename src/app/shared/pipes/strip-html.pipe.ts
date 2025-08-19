import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml',
  standalone: true, // If using Angular 14+ and standalone components
})
export class StripHtmlPipe implements PipeTransform {
  transform(html: string | null | undefined): string {
    if (!html) {
      return '';
    }
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || 'No Text Input Found';
  }
}
