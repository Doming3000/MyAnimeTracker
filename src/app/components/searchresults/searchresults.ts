import { Anime, MyAnime } from "src/app/interfaces/api-movies";
import { AnimeService } from "src/app/services/anime.service";
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { Alerts } from '../alerts/alerts';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: "app-searchresults",
  templateUrl: "./searchresults.html",
  styleUrls: ["./searchresults.css"],
})
export class SearchResults implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;
  @ViewChild(Alerts) alerts!: Alerts;
  
  searchForm: FormGroup;
  anime_results: Anime[] = [];
  resultsVisible: boolean = false;
  animateClosing: boolean = false;
  noResultsFound: boolean = false;
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
    // Obtener el término de búsqueda desde los parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      const term = params['term'];
      if (term) {
        this.searchTerm = term;
        this.search(term);
      }
    });
    
    // Suscripción al término de búsqueda del servicio de búsqueda
    this.searchTermSubscription = this.searchService.searchTerm$.pipe(
      debounceTime(300)
    ).subscribe(term => {
      if (term.trim()) {
        this.search(term);
      }
    });
    
    // Suscripción a los resultados de búsqueda del servicio de anime
    this.animeSubscription = this.animeService.getResultAnime().subscribe(result => {
      this.anime_results = result;
    });
  }
  
  // Configuración después de que la vista ha sido inicializada
  ngAfterViewInit(): void {
    this.resultsContainer.nativeElement.addEventListener('scroll', this.onContainerScroll);
  }
  
  // Limpieza cuando el componente es destruido
  ngOnDestroy(): void {
    this.cleanup();
  }
  
  // Realizar la búsqueda de animes
  search(term: string): void {
    if (term.trim() === '') {
      this.noResultsFound = true;
      this.anime_results = [];
      this.resultsVisible = false;
      return;
    }
    
    // Mostrar cursor de progreso y deshabilitar desplazamiento
    document.body.style.cursor = "progress";
    document.documentElement.style.overflowY = 'hidden';
    this.currentScrollY = window.scrollY;
    window.onscroll = () => window.scrollTo(0, this.currentScrollY);
    
    // Solicitar animes al servicio
    this.animeService.getAnimes(term).subscribe(result => {
      document.body.style.cursor = "default";
      this.anime_results = result.data;
      this.resultsVisible = true;
      this.noResultsFound = this.anime_results.length === 0;
    });
  }
  
  // Navegar a la página de inicio
  goHome(): void {
    this.router.navigate(['/']);
    this.restoreScrollAndOverflow();
  }
  
  // Agregar anime a la lista seleccionada
  addAnime(anime: Anime): void {
    const addAnime: MyAnime = {
      id: anime.mal_id,
      title: anime.title,
      imagen: anime.images["jpg"].image_url,
      total_episodes: anime.episodes,
      watched_episodes: 0,
      markedAsViewed: false,
      link: "",
    };
    this.animeService.animeSelected(addAnime);
  }
  
  // Manejar el evento de desplazamiento del contenedor de resultados
  onContainerScroll = (): void => {
    this.updateProgressBar();
  }
  
  // Actualizar la barra de progreso de desplazamiento
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
  
  // Limpiar suscripciones y restaurar el comportamiento de desplazamiento
  private cleanup(): void {
    document.documentElement.style.overflowY = 'visible';
    window.onscroll = null;
    if (this.searchTermSubscription) this.searchTermSubscription.unsubscribe();
    if (this.animeSubscription) this.animeSubscription.unsubscribe();
  }
  
  // Restaurar el comportamiento de desplazamiento
  private restoreScrollAndOverflow(): void {
    document.documentElement.style.overflowY = 'visible';
    window.onscroll = null;
  }
}