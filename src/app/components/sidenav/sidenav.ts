import { Component, ViewChild } from '@angular/core';
import { WebAlerts } from '../webalerts/web-alerts';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css']
})
export class SideNav {
  @ViewChild(WebAlerts) webalerts!: WebAlerts;
  
  isOpen: boolean = false;
  
  // Abrir el menú lateral
  openNav() {
    this.isOpen = true;
  }
  
  // Cerrar el menú lateral
  closeNav() {
    this.isOpen = false;
  }
  
  // Exportar datos a un archivo CSV
  exportData() {
    const storedData = localStorage.getItem('my_anime');
    
    if (!storedData || storedData === '[]') {
      this.triggerErrorAlert('Vaya!', 'No hay nada que descargar');
      return;
    }
    
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
  
  // Importar datos desde un archivo CSV
  importData(event: any) {
    const file = event.target.files[0];
    
    if (!file) {
      this.triggerErrorAlert('Error!', 'No se seleccionó ningún archivo');
      return;
    }
    
    else if (file.name !== 'data.csv') {
      this.triggerErrorAlert('Vaya!', 'Este no parece ser el archivo correcto');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const content = e.target.result;
      try {
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          this.triggerErrorAlert('Error!', 'El contenido no tiene el formato correcto');
          return;
        }
        
        localStorage.setItem('my_anime', JSON.stringify(data));
        this.triggerSuccessAlert('Hecho!', 'Datos importados con éxito');
        
      } catch (error) {
        this.triggerErrorAlert('Vaya!', 'El archivo parece estar dañado y no es posible importarlo');
      }
    };
    
    reader.readAsText(file);
  }
  
  // Mostrar alerta de éxito
  triggerSuccessAlert(title: string, message: string) {
    this.webalerts.showAlert('success', title, message);
  }
  
  // Mostrar alerta de error
  triggerErrorAlert(title: string, message: string) {
    this.webalerts.showAlert('error', title, message);
  }
}