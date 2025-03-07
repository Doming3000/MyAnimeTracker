import { Component, HostListener , ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { AnimeService } from 'src/app/services/anime.service';
import { AlertService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})

export class Navigation {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  // Variables
  isOpen: boolean = false;
  inputEmpty: boolean = false;
  searchTerm: string = '';
  
  // Inyección de dependencias
  constructor(private router: Router, private searchService: SearchService, private animeService: AnimeService, private alertService: AlertService) {}
  
  // Navegar a la página principal
  goHome() {
    this.router.navigate(['/']);
    this.searchService.updateSearchTerm("");
    document.documentElement.style.overflowY = 'visible';
    this.isOpen = false;
  }
  
  // Navegar a mi lista
  goMyList() {
    this.router.navigate(['/mylist']);
    this.searchService.updateSearchTerm("");
    this.isOpen = false;
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
    const storedData = localStorage.getItem('myAnimes');
    if (!storedData || storedData === '[]') {
      return this.alertService.triggerAlert('error', 'Error!', 'No hay nada que descargar.');
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
      this.alertService.triggerAlert('error', 'Error!', 'Por favor, selecciona un archivo JSON válido.');
      this.resetFileInput(event.target);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      this.processImportedData(content, event.target);
    };
    
    reader.onerror = () => {
      this.alertService.triggerAlert('error', 'Error!', 'Ha ocurrido un error al leer el contenido del archivo.');
      this.resetFileInput(event.target);
    };
    
    reader.readAsText(file);
  }
  
  // Procesar los datos importados
  private processImportedData(content: string, inputElement: HTMLInputElement) {
    try {
      const data = JSON.parse(content);
      const storedData = localStorage.getItem('myAnimes');
      
      if (!storedData || storedData === '[]') {
        // Si no hay datos existentes, importar directamente
        this.saveImportedData(data, inputElement);
        return;
      }
      // Cerrar menú de navegación para evitar overlays duplicados
      this.isOpen = false;
      
      // Mostrar modal de confirmación antes de sobrescribir
      this.alertService.triggerConfirm({
        title: 'Confirmar Importación',
        message: '¿Estás seguro de que deseas importar estos datos?<br>La información actual se perderá si no está respaldada.',
        yesText: 'Sí, quiero importar',
        noText: 'No, cambié de opinión',
        callback: () => this.saveImportedData(data, inputElement),
        cancelCallback: () => this.resetFileInput(inputElement),
      });
    } catch (error) {
      this.alertService.triggerAlert('error', 'Error!', `Ha ocurrido un error y no es posible importar el archivo.`);
      this.resetFileInput(inputElement);
    }
  }
  
  // Guardar los datos importados
  private saveImportedData(data: any[], inputElement: HTMLInputElement) {
    localStorage.setItem('myAnimes', JSON.stringify(data));
    this.alertService.triggerAlert('success', 'Hecho!', 'Datos importados con éxito.');
    this.animeService.updateAnimeList(data);
    this.resetFileInput(inputElement);
    this.isOpen = false;
  }
  
  // Eliminar todos los datos
  nukeData() {
    const storedData = localStorage.getItem('myAnimes');
    if (!storedData || storedData === '[]') {
      this.alertService.triggerAlert('error', 'Error!', 'No hay nada que eliminar.');
      return;
    }
    
    // Cerrar menú de navegación para evitar overlays duplicados
    this.isOpen = false;
    
    // Mostrar confirmación antes de eliminar
    this.alertService.triggerConfirm({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar todos tus datos?<br>Esta acción es irreversible.',
      yesText: 'Sí, eliminar datos',
      noText: 'No, cambié de opinión',
      callback: () => {
        this.alertService.triggerAlert('success', 'Hecho!', 'Datos eliminados con éxito.');
        this.animeService.updateAnimeList([]);
      }
    });
  }
  
  // Resetear el valor del input de archivo
  resetFileInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
  
  // Navegar a about (pendiente)
  goAbout() {
    this.alertService.triggerAlert('error', 'Proximamente!', 'lorem Ipsum dolor sit amet');
  }
  
  // Escuchar eventos de teclado mediante HostListener
  @HostListener('document:keydown', ['$event'])
  
  handleKeyboardEvent(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    
    // Ignorar eventos de teclado si se está en un input 
    if (target.tagName === 'INPUT') {
      return;
    }
    
    switch (event.key) {
      case 'Escape':
      if (this.isOpen) {
        this.closeNav();
      }
      break;
      
      case 'ArrowRight':
      if (!this.isOpen) {
        this.openNav();
      }
      break;
      
      case 'ArrowLeft':
      if (this.isOpen) {
        this.closeNav();
      }
      break;
      
      default:
      break;
    }
  }
}