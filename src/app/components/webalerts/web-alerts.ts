import { Component } from '@angular/core';

@Component({
  selector: 'app-web-alerts',
  templateUrl: './web-alerts.html',
  styleUrls: ['./web-alerts.css']
})
export class WebAlerts {
  isToastVisible: boolean = false;
  isConfirmVisible: boolean = false;
  alertType: string = '';
  title: string = '';
  message: string = '';
  timer: any;
  
  confirmTitle: string = '';
  confirmMessage: string = '';
  confirmYesText: string = '';
  confirmNoText: string = '';
  confirmCallback!: () => void;
  
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
  showConfirm(title: string, message: string, yesText: string, noText: string, callback: () => void) {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.confirmYesText = yesText;
    this.confirmNoText = noText;
    this.confirmCallback = callback;
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