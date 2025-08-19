import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // Subject for broadcasting generic events
  private eventSubject = new Subject<{ event: string; payload?: any }>();

  // Observable for subscribers
  public event$: Observable<{ event: string; payload?: any }> =
    this.eventSubject.asObservable();

  /**
   * Broadcasts an event with an optional payload.
   * @param event The event name or type
   * @param payload Optional data associated with the event
   */
  emitEvent(event: string, payload?: any): void {
    this.eventSubject.next({ event, payload });
  }

  /**
   * Clears all emitted events.
   */
  clearEvents(): void {
    this.eventSubject.complete();
    this.eventSubject = new Subject<{ event: string; payload?: any }>();
    this.event$ = this.eventSubject.asObservable();
  }
}
