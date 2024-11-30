// searchresults.component.ts
import { Anime, MyAnime } from "src/app/interfaces/api-movies";
import { AnimeService } from "src/app/services/anime.service";
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { Alerts } from '../alerts/alerts';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: "app-searchresults",
  templateUrl: "./searchresults.html",
  styleUrls: ["./searchresults.css"],
})
export class SearchResults implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;
  @ViewChild(Alerts) alerts!: Alerts;
  
  anime_results: Anime[] = [];
  isLoading: boolean = false;
  noResultsFound: boolean = false;
  resultsVisible: boolean = false;
  searchForm: FormGroup;
  searchTerm: string = '';
  
  private searchTermSubscription!: Subscription;
  private animeSubscription!: Subscription;
  private currentScrollY = 0;
  
  // Inyección de dependencias
  constructor(
    private animeService: AnimeService,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: ["", Validators.required],
    });
  }
  
  // Inicialización del componente
  ngOnInit(): void {
    // Suscripción a los parámetros de consulta de la ruta
    this.searchTermSubscription = this.route.queryParams.pipe(
      switchMap(params => {
        // Mostrar cursor de progreso y deshabilitar el desplazamiento
        document.body.style.cursor = "progress";
        document.documentElement.style.overflowY = 'hidden';
        this.currentScrollY = window.scrollY;
        
        // Mantener la posición de scroll fija durante la carga
        window.onscroll = () => window.scrollTo(0, this.currentScrollY);
        
        const term = params['term'];
        this.isLoading = true;
        
        // Si existe un término de búsqueda en los parámetros de la URL
        if (term) {
          this.searchTerm = term;
          return this.animeService.getAnimes(term); // Realizar la búsqueda basada en el término
        } else {
          // Si no existe un término en la URL, escuchar los cambios en searchTerm$
          return this.searchService.searchTerm$.pipe(
            debounceTime(300), // Retrasar la búsqueda para evitar múltiples solicitudes rápidas
            switchMap(searchTerm => {
              // Validar si el término de búsqueda no está vacío
              if (searchTerm.trim()) {
                this.searchTerm = searchTerm;
                return this.animeService.getAnimes(searchTerm); // Realizar la búsqueda
              } else {
                return this.animeService.getAnimes(''); // Manejar la búsqueda con un término vacío
              }
            })
          );
        }
      })
    ).subscribe(
      result => {
        // Manejar la respuesta exitosa de la búsqueda
        this.anime_results = result.data;
        this.resultsVisible = true;
        this.noResultsFound = this.anime_results.length === 0;
        this.isLoading = false;
        document.body.style.cursor = "default";
        
        // Comprobar si el contenedor de resultados existe antes de desplazar el scroll
        if (this.resultsContainer && this.resultsContainer.nativeElement) {
          this.resultsContainer.nativeElement.scrollTo(0, 0);
          this.updateProgressBar();
        }
      },
      error => {
        // Manejar errores en la solicitud de búsqueda
        this.isLoading = false;
        document.body.style.cursor = "default";
        
        // Manejo específico de errores HTTP
        if (error.status) {
          switch (error.status) {
            case 400:
            alert("(Error 400) La solicitud es inválida. Por favor, verifique correctamente los términos de búsqueda e inténtelo nuevamente.");
            this.router.navigate(['/']);
            break;
            
            case 408:
            alert("(Error 408) La solicitud tardó demasiado tiempo en completarse, seguramente debido a un error de red o conexión con el servidor. Por favor, vuelva a intentarlo más tarde.");
            this.router.navigate(['/']);
            break;
            
            case 429:
            alert("(Error 429) Demasiadas peticiones. Por favor, espere un momento antes de volver a realizar una búsqueda y evite realizar búsquedas demasiado rápido.");
            this.router.navigate(['/']);
            break;
            
            case 500:
            alert("(Error 500) Ha ocurrido un problema con el servidor. Por favor, vuelva a intentarlo más tarde.");
            this.router.navigate(['/']);
            break;
            
            case 502:
            alert("(Error 502) Ha ocurrido un problema con la comunicación entre servidores. Por favor, vuelva a intentarlo más tarde.");
            this.router.navigate(['/']);
            break;
            
            case 503:
            alert("(Error 503) El servicio no está disponible en este momento. Por favor, vuelva a intentarlo más tarde.");
            this.router.navigate(['/']);
            break;
            
            default:
            alert(`Ha ocurrido un error inesperado (Error ${error.status}): ${error.message}.`);
            this.router.navigate(['/']);
            break;
          }
        } else {
          // Manejo de errores inesperados sin código de estado HTTP
          alert('Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.');
          this.router.navigate(['/']);
        }
      }
    );
  }
  
  // Configuración después de que la vista ha sido inicializada
  ngAfterViewInit(): void {
    this.resultsContainer.nativeElement.addEventListener('scroll', this.onContainerScroll);
  }
  
  // Limpieza cuando el componente es destruido
  ngOnDestroy(): void {
    this.cleanup();
  }
  
  // Navegar a la página de inicio
  goHome(): void {
    this.router.navigate(['/']);
    this.restoreScrollAndOverflow();
    document.body.style.cursor = "default";
    this.searchService.updateSearchTerm(""); 
  }
  
  // Agregar un anime a mi lista
  addAnime(anime: Anime): void {
    const addAnime: MyAnime = {
      id: anime.mal_id,
      title: anime.title,
      type: anime.type,
      url: anime.url,
      status: anime.status,
      image: anime.images["jpg"].large_image_url,
      total_episodes: anime.episodes,
      watched_episodes: 0,
      markedAsViewed: false,
      isModalOpen: false,
    };
    this.animeService.animeSelected(addAnime);
  }
  
  // Ver anime en My Anime List (MAL)
  viewOnMal(url: string): void {
    window.open(url, '_blank');
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
  
  // Restaurar el comportamiento de desplazamiento
  private restoreScrollAndOverflow(): void {
    document.documentElement.style.overflowY = 'visible';
    document.body.style.cursor = "default"; 
    window.onscroll = null;
  }
  
  // Limpiar suscripciones y restaurar el comportamiento de desplazamiento
  private cleanup(): void {
    document.documentElement.style.overflowY = 'visible';
    window.onscroll = null;
    if (this.searchTermSubscription) this.searchTermSubscription.unsubscribe();
    if (this.animeSubscription) this.animeSubscription.unsubscribe();
    document.body.style.cursor = "default"; 
  }
}