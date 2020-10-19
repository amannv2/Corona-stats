import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestService {
  data;

  constructor(private http: HttpClient) {}

  sendRequest(path: string) {
    return this.http.get(path);
  }
}
