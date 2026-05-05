import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoanPage } from './model/loanpage';

@Injectable({
  providedIn: 'root',
})
export class LoanService {

  private baseUrl = 'http://localhost:8080/loan';

  constructor(private http: HttpClient) {}

  getLoans(
    page: number,
    size: number,
    clientId?: number,
    gameId?: number,
    date?: string
  ): Observable<LoanPage> {

    let params: any = {
      page,
      size
    };

    if (clientId) params.clientId = clientId;
    if (gameId) params.gameId = gameId;
    if (date) params.date = date;

    return this.http.get<LoanPage>(this.baseUrl, { params });
  }

  saveLoan(loanDto: any): Observable<void> {
    if (!loanDto.id) {
      return this.http.post<void>(this.baseUrl, loanDto);
    } else {
      return this.http.put<void>(`${this.baseUrl}/${loanDto.id}`, loanDto);
    }
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}