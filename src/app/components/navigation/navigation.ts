import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../alerts/alerts';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})

export class Navigation {
  @ViewChild(Alerts) alerts!: Alerts;
  
  // Variables
  isOpen: boolean = false;
  inputEmpty: boolean = false;
  searchTerm: string = '';
  
  // Inyección de dependencias
  constructor(private router: Router, private searchService: SearchService) {}
  
  // Navegar a la página principal
  goHome() {
    this.router.navigate(['/']);
    this.searchService.updateSearchTerm("");
    document.documentElement.style.overflowY = 'visible';
  }
  
  // Abrir/Cerrar el menú lateral
  openNav() {
    this.isOpen = true;
  }
  
  closeNav() {
    this.isOpen = false;
  }
  
  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });
  }
  
  // Realizar búsqueda con el término ingresado
  search() {
    if (this.searchTerm.trim() == '') {
      this.inputEmpty = true;
      this.triggerShakeAnimation();
    } else {
      window.scrollTo(0, 0);
      this.inputEmpty = false;
      this.router.navigate(['/searchresults']);
      this.searchService.updateSearchTerm(this.searchTerm);
      this.router.navigate(['/searchresults'], { queryParams: { term: this.searchTerm } });
    }
  }
  
  // Limpiar el buscador
  clearInput() {
    if (this.searchTerm === '') {
      this.triggerShakeAnimation();
    } else {
      this.searchTerm = '';
      this.inputEmpty = false;
      this.searchService.updateSearchTerm('');
    }
  }
  
  // Activar animación de sacudida en el buscador
  triggerShakeAnimation() {
    const inputElement = document.querySelector('.search-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.classList.add('shake-placeholder');
      setTimeout(() => {
        inputElement.classList.remove('shake-placeholder');
      }, 500);
    }
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        
        // Verificar el formato de los datos
        if (!Array.isArray(data)) {
          this.triggerErrorAlert('Error!', 'El contenido del archivo no tiene el formato correcto');
          this.resetFileInput(event.target);
          return;
        }
        
        // Importar si no hay datos ya existentes en el almacenamiento local
        else if (!storedData || storedData === '[]') {
          this.triggerSuccessAlert('Hecho!', 'Datos importados con éxito');
          localStorage.setItem('my_anime', JSON.stringify(data));
          this.resetFileInput(event.target);
        }
        
        else {
          // Cerrar menú de navegación para evitar overlays duplicados
          this.isOpen = false;
          
          // Mostrar confirmación antes de sobrescribir
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
  
  nukeData() {
    const storedData = localStorage.getItem('my_anime');
    if (!storedData || storedData === '[]') {
      this.triggerErrorAlert('Vaya!', 'No hay nada que eliminar');
      return;
    }
    
    // Cerrar menú de navegación para evitar overlays duplicados
    this.isOpen = false;
    
    // Mostrar confirmación antes de eliminar
    this.alerts.showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar todos tus datos?<br>Esta acción es irreversible.',
      yesText: 'Sí, eliminar datos',
      noText: 'No, cambié de opinión',
      callback: () => {
        localStorage.clear();
        this.triggerSuccessAlert('Hecho!', 'Datos eliminados con éxito');
      }
    });
  }
  
  // Mostrar alerta de éxito
  triggerSuccessAlert(title: string, message: string) {
    this.alerts.showAlert('success', title, message);
  }
  
  // Mostrar alerta de error
  triggerErrorAlert(title: string, message: string) {
    this.alerts.showAlert('error', title, message);
  }
  
  // Resetear el valor del input de archivo
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}