import { Injectable, ComponentRef, TemplateRef, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ContextualMenuService {
  private contextualComponent = new Subject<ComponentType<any>>();
  contextualComponent$ = this.contextualComponent.asObservable();
  constructor(private _injector: Injector) {}

  openComponentInContextualMenu<T>(componentOrTemplateRef: ComponentType<T>) {
    this.contextualComponent.next(componentOrTemplateRef);
  }
}
