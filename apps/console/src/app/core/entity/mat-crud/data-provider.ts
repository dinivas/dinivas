import { Observable } from 'rxjs/';
import { HttpParams } from '@angular/common/http';
export interface DataProvider<T> {
    getDatas(httpParams: HttpParams): Observable<T>;
    delete(entity: any): Observable<T>;
    deleteSelected(selection: any[]): Observable<T>;
}
