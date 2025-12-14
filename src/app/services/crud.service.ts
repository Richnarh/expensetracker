import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment as env } from "@env/environment";
import { catchError, forkJoin, map, Observable, Subject, throwError } from 'rxjs';
import { ApiResponse } from '@app/utils/apiResponse';


@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private http = inject(HttpClient);

  private dataSubject = new Subject<any>();
  public data$ = this.dataSubject.asObservable();
  
  constructor() {
   }

  setData(data?: any) { 
    this.dataSubject.next(data);
  }

  save(payload: any, path:string) {
    if (!payload.id){
      return this.http.post<ApiResponse<any>>(`${env.endpoint}/${path}`, payload)
      .pipe(catchError((error:HttpErrorResponse) => this.handleError(error)));
    }else{
      return this.http.put<ApiResponse<any>>(`${env.endpoint}/${path}`, payload)
      .pipe(catchError((error:HttpErrorResponse) => this.handleError(error)));
    }
  }

  post(payload:any, path:string){
    return this.http.post<ApiResponse<any>>(`${env.endpoint}/${path}`, payload);
  }

  findById(id:string, path:string){
    return this.http.get<ApiResponse<any>>(`${env.endpoint}/${path}/${id}`)
    .pipe(catchError((error:HttpErrorResponse) => this.handleError(error)));
  }

  fetchPagedData(query:string, path:string){
    return this.http.get<ApiResponse<any>>(`${env.endpoint}/${path}/all?${query}`);
  }

  fetchAll(path:string){
    return this.http.get<ApiResponse<any>>(`${env.endpoint}/${path}`)
    .pipe(catchError((error:HttpErrorResponse) => this.handleError(error)));
  }

  delete(id: string, path:string){
    return this.http.delete<any>(`${env.endpoint}/${path}/${id}`)
    .pipe(catchError((error:HttpErrorResponse) => this.handleError(error)));
  }

  deleteAll(arr:any[], path:string){
    const request$ = arr.map(id => this.delete(id, path));
    return forkJoin(request$).pipe(map((res) => res))
    .pipe(catchError((error:HttpErrorResponse) => this.handleError(error)));
  }

  checkAvailability(value:string, path:string){
    return this.http.get<ApiResponse<any>>(`${env.endpoint}/${path}/${value}`, { withCredentials: true })
    .pipe(catchError((error:HttpErrorResponse) => this.handleError(error)));
  }

  public handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || 'Something went wrong; please try again later.';
    return throwError(() => new Error(errorMessage));
  }
}
