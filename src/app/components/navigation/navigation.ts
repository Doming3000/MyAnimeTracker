import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef;
  
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
    if (!this.searchTerm.trim()) {
      this.inputEmpty = true;
      return this.triggerShakeAnimation();
    }
    
    this.inputEmpty = false;
    window.scrollTo(0, 0);
    this.searchService.updateSearchTerm(this.searchTerm);
    this.router.navigate(['/searchresults'], { queryParams: { term: this.searchTerm } });    
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
  
  // Exportar datos a un archivo json
  exportData() {
    const storedData = localStorage.getItem('my_anime');
    if (!storedData || storedData === '[]') {
      return this.triggerAlert('error', 'Error!', 'No hay nada que descargar.');
    }
    
    // Parsear los datos y volver a formatearlos con indentación
    const parsedData = JSON.parse(storedData);
    const formattedData = JSON.stringify(parsedData, null, 2)
    
    const blob = new Blob([formattedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Importar datos desde un archivo JSON
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  
  importData(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !file.name.endsWith('.json')) {
      this.triggerAlert('error', 'Error!', 'Por favor, selecciona un archivo JSON válido.');
      this.resetFileInput(event.target);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      this.processImportedData(content, event.target);
    };
    
    reader.onerror = () => {
      this.triggerAlert('error', 'Error!', 'Ha ocurrido un error al leer el contenido del archivo.');
      this.resetFileInput(event.target);
    };
    
    reader.readAsText(file);
  }
  
  // Procesar los datos importados
  private processImportedData(content: string, inputElement: HTMLInputElement) {
    try {
      const data = JSON.parse(content);
      const storedData = localStorage.getItem('my_anime');
      
      if (!storedData || storedData === '[]') {
        // Si no hay datos existentes, importar directamente
        this.saveImportedData(data, inputElement);
      } else {
        // Cerrar menú de navegación para evitar overlays duplicados
        this.isOpen = false;
        
        // Mostrar modal de confirmación antes de sobrescribir
        this.alerts.showConfirm({
          title: 'Confirmar Importación',
          message: '¿Estás seguro de que deseas importar estos datos?<br>La información actual se perderá si no está respaldada.',
          yesText: 'Sí, quiero importar',
          noText: 'No, cambié de opinión',
          callback: () => this.saveImportedData(data, inputElement),
          cancelCallback: () => this.resetFileInput(inputElement),
        });
      }
    } catch (error) {
      this.triggerAlert('error', 'Error!', `Ha ocurrido un error y no es posible importar el archivo.`);
      this.resetFileInput(inputElement);
    }
  }
  
  // Guardar los datos importados
  private saveImportedData(data: any[], inputElement: HTMLInputElement) {
    localStorage.setItem('my_anime', JSON.stringify(data));
    this.triggerAlert('success', 'Hecho!', 'Datos importados con éxito.');
    this.resetFileInput(inputElement);
  }
  
  // Eliminar todos los datos
  nukeData() {
    const storedData = localStorage.getItem('my_anime');
    if (!storedData || storedData === '[]') {
      this.triggerAlert('error', 'Error!', 'No hay nada que eliminar.');
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
        this.triggerAlert('success', 'Hecho!', 'Datos eliminados con éxito.');
      }
    });
  }
  
  // Resetear el valor del input de archivo
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
  
  // Mostrar alertas
  triggerAlert(type: 'success' | 'error', title: string, message: string) {
    this.alerts.showAlert(type, title, message);
  }
}