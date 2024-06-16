import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css']
})
export class Alerts {
  // Propiedades para manejar el estado de las alertas
  isToastVisible: boolean = false;
  isConfirmVisible: boolean = false;
  alertType: string = '';
  title: string = '';
  message: string = '';
  timer: any;
  
  // Propiedades para manejar la modal de confirmación
  confirmTitle: string = '';
  confirmMessage: string = '';
  confirmYesText: string = '';
  confirmNoText: string = '';
  confirmCallback!: () => void;
  confirmCancelCallback!: () => void;
  
  constructor() {}
  
  // Mostrar alerta tipo toast
  showAlert(type: string, title: string, message: string) {
    this.clearToast();
    
    this.alertType = type;
    this.title = title;
    this.message = message;
    this.isToastVisible = true;
    
    this.timer = setTimeout(() => {
      this.isToastVisible = false;
    }, 3000);
  }
  
  // Mostrar modal de confirmación
  showConfirm(options: {
    title: string,
    message: string,
    yesText: string,
    noText: string,
    callback: () => void,
    cancelCallback?: () => void
  }) {
    this.confirmTitle = options.title;
    this.confirmMessage = options.message;
    this.confirmYesText = options.yesText;
    this.confirmNoText = options.noText;
    this.confirmCallback = options.callback;
    this.confirmCancelCallback = options.cancelCallback || (() => {});
    this.isConfirmVisible = true;
  }
  
  // Acción de confirmación
  confirmAction() {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.isConfirmVisible = false;
  }
  
  // Acción de cancelación
  cancelAction() {
    if (this.confirmCancelCallback) {
      this.confirmCancelCallback();
    }
    this.isConfirmVisible = false;
  }
  
  // Cerrar alerta tipo toast
  closeAlert() {
    this.isToastVisible = false;
    clearTimeout(this.timer);
  }
  
  // Limpiar cualquier alerta toast visible
  private clearToast() {
    if (this.isToastVisible) {
      this.isToastVisible = false;
      clearTimeout(this.timer);
    }
  }
}