import { Injectable, isDevMode } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {

  constructor() {
  }

  public isDevMode(): boolean{
    return isDevMode();
  }

  public getApiUrl(): string{
    return environment.apiUrl;
  }
}
