import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha'

import { FormsModule } from '@angular/forms';


import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { tokenInterceptor } from './utils/token.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
      withInterceptors([authInterceptor])),
    UserService,
    CommonModule,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey:'6LeotH0sAAAAAA64glt61y1KTK7CxlDGYmTGGe7p'
        // siteKey: '6LfC7m8sAAAAACJROJJavsNEyou509YVnfdEoVU1' //  PARA PRUEBAS
      },
    },
  ]

};
