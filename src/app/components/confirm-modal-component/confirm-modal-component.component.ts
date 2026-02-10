import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal-component',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal-component.component.html',
  styleUrl: './confirm-modal-component.component.css'
})
export class ConfirmModalComponentComponent {
  @Input() showCancel: boolean = true; // Por defecto es true
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Estás seguro de que deseas realizar esta acción?';
  @Input() btnOkText: string = 'Confirmar';
  @Input() btnCancelText: string = 'Cancelar';
  // En el Modal
 @Input() okBtnClass: string = 'btn-primary'; // Clase CSS por defecto

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
