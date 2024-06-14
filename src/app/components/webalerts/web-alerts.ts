import { Component } from '@angular/core';

@Component({
  selector: 'app-web-alerts',
  templateUrl: './web-alerts.html',
  styleUrls: ['./web-alerts.css']
})
export class WebAlerts {
  isVisible: boolean = false;
  alertType: string = 'success';
  title: string = '';
  message: string = '';
  
  showAlert(type: string, title: string, message: string) {
    this.alertType = type;
    this.title = title;
    this.message = message;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }
  
  closeAlert() {
    this.isVisible = false;
  }
}