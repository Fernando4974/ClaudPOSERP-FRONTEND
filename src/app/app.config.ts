import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';

import { authInterceptor } from './interceptors/auth.interceptor';
import { environment } from '../environments/environment';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';


import localeEsCo from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';
// import { tokenRefreshInterceptor } from './utils/token.interceptor';

registerLocaleData(localeEsCo);
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Esto configura el idioma y la zona horaria para toda la app
    { provide: LOCALE_ID, useValue: 'es-CO' },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Se pueden pasar ambos en un solo array
    ),
    // UserService es un servicio, si tiene @Injectable({providedIn: 'root'}) no es necesario aquí,
    // pero dejarlo no rompe nada.
    UserService,

    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.siteKey
      },
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        oneTapEnabled: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.ID_CLIENTE_GOOGLE, { oneTapEnabled: false })
          }
        ],
        onError: (err) => {
          console.error('Social Auth Error:', err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
