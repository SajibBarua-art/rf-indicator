import { Injectable } from '@angular/core';
import { AppFuseDrawerComponent } from './drawer.component';

@Injectable({ providedIn: 'root' })
export class FuseDrawerService {
  private _componentRegistry: Map<string, AppFuseDrawerComponent> = new Map<
    string,
    AppFuseDrawerComponent
  >();

  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register drawer component
   *
   * @param name
   * @param component
   */
  registerComponent(name: string, component: AppFuseDrawerComponent): void {
    this._componentRegistry.set(name, component);
  }

  /**
   * Deregister drawer component
   *
   * @param name
   */
  deregisterComponent(name: string): void {
    this._componentRegistry.delete(name);
  }

  /**
   * Get drawer component from the registry
   *
   * @param name
   */
  getComponent(name: string): AppFuseDrawerComponent | undefined {
    return this._componentRegistry.get(name);
  }
}
