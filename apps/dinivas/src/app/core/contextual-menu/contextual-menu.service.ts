import { Injectable, ComponentRef, TemplateRef, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ContextualMenuService {
  private contextualComponent = new Subject<{
    component: ComponentType<any>;
    data?: any;
  }>();
  contextualComponent$ = this.contextualComponent.asObservable();
  constructor(private _injector: Injector) {}

  openComponentInContextualMenu<T>(
    componentOrTemplateRef: ComponentType<T>,
    data?: any
  ) {
    this.contextualComponent.next({ component: componentOrTemplateRef, data });
  }
}
