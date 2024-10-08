import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css']
})
export class Alerts {
  // Propiedades para manejar el estado de las alertas tipo toast
  isToastVisible: boolean = false;
  alertType: string = '';
  title: string = '';
  message: string = '';
  timer: any;
  
  // Propiedades para manejar el estado del modal de confirmación
  isConfirmVisible: boolean = false;
  confirmTitle: string = '';
  confirmMessage: string = '';
  confirmYesText: string = '';
  confirmNoText: string = '';
  confirmCallback!: () => void;
  confirmCancelCallback!: () => void;
  
  constructor() {}
  
  // Mostrar alerta tipo toast
  showAlert(type: string, title: string, message: string) {
    // Comprobar si ya hay una alerta visible
    if (this.isToastVisible) {
      const toastElement = document.querySelector('.toast') as HTMLElement;
      if (toastElement) {
        toastElement.classList.remove('shakeToast');
        void toastElement.offsetWidth;
        toastElement.classList.add('shakeToast');        
      }
      // Mostrar alerta nueva
    } else {
      this.isToastVisible = true;
      this.alertType = type;
      this.title = title;
      this.message = message;
      
      setTimeout(() => {
        const progressElement = document.querySelector('.progress') as HTMLElement;
        if (progressElement) {
          progressElement.classList.add('active');
        }
      }, 0);
      
      // Cerrar alerta después de unos segundos
      this.timer = setTimeout(() => {
        this.isToastVisible = false;
        this.resetProgress();
      }, 3000);
    }
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
    this.resetProgress();
  }
  
  // Reiniciar la barra de progreso
  private resetProgress() {
    const progressElement = document.querySelector('.progress') as HTMLElement;
    if (progressElement) {
      progressElement.classList.remove('active');
      void progressElement.offsetWidth;
    }
  }
}