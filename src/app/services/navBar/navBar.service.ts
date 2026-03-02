import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NavBarService{

// Creamos una señal reactiva que empieza en 'false'
  showExitButton = signal<boolean>(false);

  // Método para actualizar el estado
  setExitButtonVisibility(visible: boolean) {
    this.showExitButton.set(visible);
  }


}
