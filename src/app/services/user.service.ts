import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get(`${this.userUrl}`)
  }
  createUser(user: any) {
    return this.http.post(`${this.userUrl}`, user);
  }
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.userUrl}?email=${email}&password=${password}`);
  }
}
