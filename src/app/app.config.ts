import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { tokenInterceptor } from './utils/token.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { environment } from '../environments/environment';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor, authInterceptor]) // Se pueden pasar ambos en un solo array
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
            provider: new GoogleLoginProvider(environment.ID_CLIENTE_GOOGLE)
          }
        ],
        onError: (err) => {
          console.error('Social Auth Error:', err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
