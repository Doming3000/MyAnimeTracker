import { Component } from '@angular/core';

@Component({
  selector: 'app-web-alerts',
  templateUrl: './web-alerts.html',
  styleUrls: ['./web-alerts.css']
})
export class WebAlerts {
  isVisible: boolean = false;
  alertType: string = '';
  title: string = '';
  message: string = '';
  timer: any;
  
  // Método para mostrar una alerta
  showAlert(type: string, title: string, message: string) {
    // Si ya hay una alerta visible, ocultarla primero
    if (this.isVisible) {
      this.isVisible = false;
      clearTimeout(this.timer);
    }
    
    // Mostrar la nueva alerta
    this.alertType = type;
    this.title = title;
    this.message = message;
    this.isVisible = true;
    
    // Iniciar el temporizador para ocultar automáticamente la alerta
    this.timer = setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }
  
  // Método para cerrar manualmente la alerta
  closeAlert() {
    this.isVisible = false;
    clearTimeout(this.timer);
  }
}