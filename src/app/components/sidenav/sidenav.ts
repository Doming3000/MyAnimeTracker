import { Component, ViewChild } from '@angular/core';
import { Alerts } from '../alerts/alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css']
})
export class SideNav {
  @ViewChild(Alerts) alerts!: Alerts;
  
  constructor(private router: Router) {}
  
  isOpen: boolean = false;
  
  goHome() {
    this.router.navigate(['/']);
  }
  
  // Abrir el menú lateral
  openNav() {
    this.isOpen = true;
  }
  
  // Cerrar el menú lateral
  closeNav() {
    this.isOpen = false;
  }
  
  // Métodos de prueba para comunicar entre rutas
  navigateToNewPage() {
    this.router.navigate(['/newpage']);
  }
  
  backToPage() {
    this.router.navigate(['/']); 
  }
  
  // Exportar datos a un archivo CSV
  exportData() {
    const storedData = localStorage.getItem('my_anime');
    
    if (!storedData || storedData === '[]') {
      this.triggerErrorAlert('Vaya!', 'No hay nada que descargar');
      return;
    }
    
    else {
      const blob = new Blob([storedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.csv';
      
      // Agregar enlace al documento y simular clic para descargar
      document.body.appendChild(a);
      a.click();
      
      // Eliminar enlace del documento
      document.body.removeChild(a);
    }
  }
  
  // Importar datos desde un archivo CSV
  importData(event: any) {
    const storedData = localStorage.getItem('my_anime');
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const content = e.target.result;
      
      try {
        const data = JSON.parse(content);
        
        // Comprobar nombre del archivo
        if (file.name !== 'data.csv') {
          this.triggerErrorAlert('Vaya!', 'Este no parece ser el archivo correcto');
          this.resetFileInput(event.target);
          return;
        }
        
        // Comprobar contenido del archivo
        else if (!Array.isArray(data)) {
          this.triggerErrorAlert('Error!', 'El contenido no tiene el formato correcto');
          this.resetFileInput(event.target);
          return;
        }
        
        // Comprobar si hay datos antes de importar
        else if (!storedData || storedData === '[]') {
          this.triggerSuccessAlert('Hecho!', 'Datos importados con éxito');
          localStorage.setItem('my_anime', JSON.stringify(data));
          this.resetFileInput(event.target);
        }
        
        else {
          // Mostrar confirmación antes de importar
          this.alerts.showConfirm({
            title: 'Confirmar Importación',
            message: '¿Estás seguro de que deseas importar estos datos?<br>La información actual se perderá si no está respaldada.',
            yesText: 'Sí, quiero importar',
            noText: 'No, cambié de opinión',
            callback: () => {
              this.triggerSuccessAlert('Hecho!', 'Datos importados con éxito');
              localStorage.setItem('my_anime', JSON.stringify(data));
              this.resetFileInput(event.target);
            },
            cancelCallback: () => {
              this.resetFileInput(event.target);
            }
          });
        }
      } catch (error) {
        this.triggerErrorAlert('Vaya!', 'El archivo parece estar dañado y no es posible importarlo');
        this.resetFileInput(event.target);
      }
    };
    reader.readAsText(file);
  }
  
  // Mostrar alerta de éxito
  triggerSuccessAlert(title: string, message: string) {
    this.alerts.showAlert('success', title, message);
  }
  
  // Mostrar alerta de error
  triggerErrorAlert(title: string, message: string) {
    this.alerts.showAlert('error', title, message);
  }
  
  // Limpiar el valor del input de archivo
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}