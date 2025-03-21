import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzerService {
  private apiUrl = 'http://localhost:3000/analyze';

  constructor(private http: HttpClient) {}

  analyze(input: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, input);
  }
}