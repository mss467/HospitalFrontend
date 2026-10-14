import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://somebody-judge-sure-optional.trycloudflare.com/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            this.setToken(response.token);
          }

          if (response && response.userId) {
            this.setUserId(response.userId);
          }

          if (response && response.username) {
            this.setUsername(response.username);
          }

          if (response && response.role) {
            this.setRole(response.role);
          }
        }),
      );
  }

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      password,
      role,
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  setUserId(userId: number | string): void {
    localStorage.setItem('userId', String(userId));
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  setRole(role: string): void {
    localStorage.setItem('role', role);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
  }
}
