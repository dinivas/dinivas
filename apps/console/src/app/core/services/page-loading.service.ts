import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoadingService {
  private _pageLoading = new Subject<boolean>();
  public lastValue: boolean;
  isPageLoading = this._pageLoading.asObservable();

  setPageLoading(isPageLoading: boolean): void {
    this._pageLoading.next(isPageLoading);
    this.lastValue = isPageLoading;
  }
}
