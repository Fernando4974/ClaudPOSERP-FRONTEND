import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { FormsModule } from '@angular/forms';


import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { tokenInterceptor } from './utils/token.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor])),
    provideHttpClient(
      withInterceptors([authInterceptor])),
    UserService,
    CommonModule,
  ]

};
