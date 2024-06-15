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

  constructor() {}

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

    if (file.name !== 'data.csv') {
      this.triggerErrorAlert('Vaya!', 'Este no parece ser el archivo correcto');
      this.resetFileInput(event.target);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const content = e.target.result;
      try {
        const data = JSON.parse(content);

        if (!Array.isArray(data)) {
          this.triggerErrorAlert('Error!', 'El contenido no tiene el formato correcto');
          this.resetFileInput(event.target);
          return;
        }

        // Mostrar confirmación antes de importar
        this.webalerts.showConfirm({
          title: 'Confirmar Importación',
          message: '¿Estás seguro de que deseas importar estos datos?<br>La información actual se perderá si no está respaldada.',
          yesText: 'Sí, importar',
          noText: 'No, cambié de opinión',
          callback: () => {
            localStorage.setItem('my_anime', JSON.stringify(data));
            this.triggerSuccessAlert('Hecho!', 'Datos importados con éxito');
            this.resetFileInput(event.target);
          },
          cancelCallback: () => {
            this.resetFileInput(event.target);
          }
        });

      } catch (error) {
        this.triggerErrorAlert('Vaya!', 'El archivo parece estar dañado y no es posible importarlo');
        this.resetFileInput(event.target);
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

  // Limpiar el valor del input de archivo
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}