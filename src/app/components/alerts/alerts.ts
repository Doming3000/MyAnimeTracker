import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css']
})
export class Alerts implements OnInit {
  // Referencias a los elementos del DOM para manipular las alertas y la barra de progreso
  @ViewChild('toast') toastElement!: ElementRef<HTMLElement>;
  @ViewChild('progress') progressElement!: ElementRef<HTMLElement>;
  
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
  
  constructor(private alertService: AlertService) {}
  
  ngOnInit() {
    // Suscripción al servicio para manejar alertas tipo toast
    this.alertService.getAlert$().subscribe((alert) => {
      this.showAlert(alert.type, alert.title, alert.message);
    });
    
    // Suscripción al servicio para manejar confirmaciones globales
    this.alertService.getConfirm$().subscribe((options) => {
      this.showConfirm(options);
    });
  }
  
  // Mostrar alerta tipo toast
  showAlert(type: string, title: string, message: string) {
    // Limpiar temporizador ya existente
    clearTimeout(this.timer);
    
    if (this.isToastVisible) {
      // Actualizar los datos de la alerta activa
      this.alertType = type;
      this.title = title;
      this.message = message;
      
      // Reiniciar la animación
      const toastElement = document.querySelector('.toast') as HTMLElement;
      if (toastElement) {
        toastElement.classList.remove('hide', 'shakeToast');
        void toastElement.offsetWidth;
        toastElement.classList.add('shakeToast');
      }
      
      // Reinicia la barra de progreso
      this.resetProgress();
      setTimeout(() => {
        this.startProgress();
      }, 0);
    } else {
      this.isToastVisible = true;
      this.alertType = type;
      this.title = title;
      this.message = message;
      
      // Iniciar la barra de progreso
      setTimeout(() => {
        this.startProgress();
      }, 0);
    }
    
    // Cerrar alerta después de unos segundos
    this.timer = setTimeout(() => {
      this.closeAlert();
    }, 3000);
  }
  
  // Activar la barra de progreso
  private startProgress() {
    const progressElement = document.querySelector('.progress') as HTMLElement;
    if (progressElement) {
      progressElement.classList.add('active');
    }
  }
  
  // Reiniciar la barra de progreso
  private resetProgress() {
    const progressElement = document.querySelector('.progress') as HTMLElement;
    if (progressElement) {
      progressElement.classList.remove('active');
      void progressElement.offsetWidth;
    }
  }
  
  // Cerrar alerta tipo toast
  closeAlert() {
    const toastElement = document.querySelector('.toast') as HTMLElement;
    
    if (toastElement) {
      toastElement.classList.add('hide');
      
      // Esperar el tiempo de la animación antes de ocultar el toast.
      setTimeout(() => {
        this.isToastVisible = false;
      }, 300);
    } else {
      this.isToastVisible = false;
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
  
  // Escuchar eventos de teclado mediante HostListener
  @HostListener('document:keydown', ['$event'])
  
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      // Cancelar con ESC
      case 'Escape':
      if (this.isConfirmVisible) {
        this.cancelAction();
      }
      break;
      
      // Confirmar con Enter
      case 'Enter':
      if (this.isConfirmVisible) {
        this.confirmAction();
      }
      break;
      
      default:
      break;
    }
  }
}