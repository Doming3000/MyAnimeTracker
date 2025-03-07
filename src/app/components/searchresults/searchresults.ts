import { Anime, MyAnime } from "src/app/interfaces/api-movies";
import { AnimeService } from "src/app/services/anime.service";
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: "app-searchresults",
  templateUrl: "./searchresults.html",
  styleUrls: ["./searchresults.css"],
})

export class SearchResults implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;
  
  // Variables
  animeResults: Anime[] = [];
  isLoading: boolean = false;
  noResultsFound: boolean = false;
  searchForm: FormGroup;
  searchTerm: string = '';
  
  private searchTermSubscription!: Subscription;
  private animeSubscription!: Subscription;
  
  // Inyección de dependencias
  constructor(
    private animeService: AnimeService,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: ["", Validators.required],
    });
  }
  
  // Inicialización del componente
  ngOnInit(): void {
    this.searchTermSubscription = this.route.queryParams.pipe(
      switchMap(params => {
        this.setCursor(true);
        const term = params['term']?.trim();
        this.isLoading = true;
        
        if (!term) { 
          this.isLoading = false;
          this.setCursor(false);
          this.router.navigate(['/']);
          return [];
        }
        
        this.searchTerm = term;
        return this.animeService.getAnimes(term);
      })
    ).subscribe({
      next: result => {
        this.animeResults = result.data || [];
        this.noResultsFound = this.animeResults.length === 0;
        this.isLoading = false;
        this.setCursor(false);
      },
      error: error => {
        this.handleError(error);
      }
    });
  }
  
  // Manejar errores en la solicitud de búsqueda
  private handleError(error: any): void {
    this.isLoading = false;
    this.setCursor(false)
    
    if (error.status) {
      const errorMessages: { [key: number]: string } = {
        400: "(Error 400) La solicitud es inválida. Por favor, verifique correctamente los términos de búsqueda e inténtelo nuevamente.",
        408: "(Error 408) La solicitud tardó demasiado tiempo en completarse. Por favor, vuelva a intentarlo más tarde.",
        429: "(Error 429) Demasiadas peticiones. Por favor, espere un momento antes de volver a realizar una búsqueda.",
        500: "(Error 500) Ha ocurrido un problema con el servidor. Por favor, vuelva a intentarlo más tarde.",
        502: "(Error 502) Ha ocurrido un problema con la comunicación entre servidores.",
        503: "(Error 503) El servicio no está disponible en este momento."
      };
      
      alert(errorMessages[error.status] || `Ha ocurrido un error inesperado (Error ${error.status}): ${error.message}.`);
    } else {
      alert('Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.');
    }
    this.router.navigate(['/']);
  }
  
  // Configuración después de que la vista ha sido inicializada
  ngAfterViewInit(): void {
    this.resultsContainer.nativeElement.addEventListener('scroll', this.onContainerScroll);
  }
  
  // Limpieza cuando el componente es destruido
  ngOnDestroy(): void {
    this.cleanup();
  }
  
  // Navegar a la página anterior
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
    this.setCursor(false)
    this.searchService.updateSearchTerm(""); 
  }
  
  // Agregar un anime a mi lista
  addAnimeToList(anime: Anime) {
    const addAnime: MyAnime = {
      id: anime.mal_id,
      title: anime.title,
      type: anime.type,
      url: anime.url,
      status: anime.status,
      image: anime.images["jpg"].large_image_url,
      totalEpisodes: anime.episodes,
      watchedEpisodes: 0,
      markedAsViewed: false,
      isModalOpen: false,
    };
    
    this.animeService.addToList(addAnime);
  }
  
  // Actualizar la barra de desplazamiento horizontal
  updateProgressBar(): void {
    const container = this.resultsContainer.nativeElement;
    const winScroll = container.scrollTop;
    const height = container.scrollHeight - container.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const myBar = document.getElementById("myBar");
    
    if (myBar) {
      myBar.style.width = scrolled + "%";
    }
  }
  
  onContainerScroll = (): void => {
    this.updateProgressBar();
  }
  
  // Limpiar suscripciones y restaurar el comportamiento de desplazamiento
  private cleanup(): void {
    if (this.searchTermSubscription) this.searchTermSubscription.unsubscribe();
    else if (this.animeSubscription) this.animeSubscription.unsubscribe();
    this.setCursor(false)
  }
  
  // Alternar el estado del cursor dependiendo del estado de carga
  setCursor(isLoading: boolean): void {
    this.isLoading = isLoading;
    document.body.style.cursor = isLoading ? "progress" : "default";
  }
}