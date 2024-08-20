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
    this.searchTermSubscription = this.route.queryParams.pipe(
      switchMap(params => {
        // Mostrar cursor de progreso y deshabilitar desplazamiento
        document.body.style.cursor = "progress";
        document.documentElement.style.overflowY = 'hidden';
        this.currentScrollY = window.scrollY;
        window.onscroll = () => window.scrollTo(0, this.currentScrollY);
        
        const term = params['term'];
        this.isLoading = true;
        if (term) {
          this.searchTerm = term;
          return this.animeService.getAnimes(term);
        } else {
          return this.searchService.searchTerm$.pipe(
            debounceTime(300),
            switchMap(searchTerm => {
              if (searchTerm.trim()) {
                this.searchTerm = searchTerm;
                return this.animeService.getAnimes(searchTerm);
              } else {
                return this.animeService.getAnimes('');
              }
            })
          );
        }
      })
    ).subscribe(
      result => {
        this.anime_results = result.data;
        this.resultsVisible = true;
        this.noResultsFound = this.anime_results.length === 0;
        this.isLoading = false;
        document.body.style.cursor = "default";
      },
      error => {
        this.isLoading = false;
        document.body.style.cursor = "default";
        console.error('ERROR', error);
        alert(`Error al realizar la búsqueda: ${error}. Por favor, inténtalo más tarde.`);
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
  }
  
  // Agregar un anime a mi lista
  addAnime(anime: Anime): void {
    const addAnime: MyAnime = {
      id: anime.mal_id,
      title: anime.title,
      imagen: anime.images["jpg"].image_url,
      total_episodes: anime.episodes,
      watched_episodes: 0,
      markedAsViewed: false,
    };
    this.animeService.animeSelected(addAnime);
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