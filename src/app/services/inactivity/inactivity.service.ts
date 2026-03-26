// auth.service.ts o un nuevo service inactividad.service.ts
import { inject, Injectable, NgZone } from '@angular/core';
import { UserService } from '../user.service';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private timeoutId: any;
  private readonly MINUTES_20 = 1 * 60 * 1000;
  private _userService = inject(UserService);
  private ngZone = inject(NgZone);

  constructor() {
    this.initListener();
  }

  initListener() {
    console.log('Inatividad iniciada')
    const events = ['mousedown', 'mousemove', 'keypress', 'touchstart'];
    this.ngZone
      .runOutsideAngular(() => {
        events.forEach((event) => {
          window.addEventListener(event, () => this.resetTimer());
        });
      });
  }

private startTimer() {
      console.log('Inatividad iniciada')
    this.timeoutId = setTimeout(() => {
      // Volvemos a la zona de Angular para ejecutar el logout y la redirección
      this.ngZone.run(() => {
        console.warn('Sesión cerrada por inactividad de 20 minutos');
        this._userService.logOut();
      });
    }, this.MINUTES_20);
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);
    this.startTimer();
  }
  stop(){
    clearTimeout(this.timeoutId)
  }
}
