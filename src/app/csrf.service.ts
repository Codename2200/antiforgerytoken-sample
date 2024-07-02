import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  private csrfToken: string = '';

  constructor(private http: HttpClient) { }

  loadCsrfToken(): Observable<any> {
    return this.http.get('http://localhost:3000/api/csrf-token', { withCredentials: true });
  }

  getToken(): Observable<any> {
    const headers = new HttpHeaders({
      'x-csrf-token': this.csrfToken
    });
    return this.http.post('http://localhost:3000/api/oauth/token', {}, { withCredentials: true, headers });
  }

  setCsrfToken(token: string) {
    this.csrfToken = token;
  }
}
