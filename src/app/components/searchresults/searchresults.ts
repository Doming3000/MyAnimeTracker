import { Anime, MyAnime } from "src/app/interfaces/api-movies";
import { AnimeService } from "src/app/services/anime.service";
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-searchresults.",
  templateUrl: "./searchresults.html",
  styleUrls: ["./searchresults.css"],
})

export class SearchResults implements OnInit, AfterViewInit {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;
  
  animateClosing: boolean = false; 
  anime_results: any[] = [];
  animeSubscription!: Subscription;
  inputEmpty: boolean = false;
  noResultsFound: boolean = false;
  noResultsMessageDisplayed: boolean = false;
  resultsVisible = false;
  searchCompleted: boolean = false;
  searchForm: FormGroup;
  searching: boolean = false;
  searchTerm: string = "";
  
  constructor(
    private animeService: AnimeService,
    private formBuilder: FormBuilder,
    private elRef: ElementRef
  ) {
    // Inicialización del formulario de búsqueda
    this.searchForm = this.formBuilder.group({
      searchTerm: ["", Validators.required],
    });
  }
  
  ngAfterViewInit(): void {
    // Agregar evento de desplazamiento al contenedor de resultados
    this.resultsContainer.nativeElement.addEventListener('scroll', this.onContainerScroll);
  }
  
  ngOnInit(): void {
    // Suscribirse a los resultados de anime
    this.animeSubscription = this.animeService.getResultAnime().subscribe((result) => {
      this.anime_results = result;
    });
  }
  
  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    this.animeSubscription.unsubscribe();
  }
  
  // Realizar búsqueda de animes
  search() {
    if (this.searchTerm.trim() !== "") {
      document.body.style.cursor = "progress";
      document.documentElement.style.overflowY = 'hidden';
      
      this.animeService.getAnimes(this.searchTerm).subscribe((result) => {
        document.body.style.cursor = "default";
        this.anime_results = result.data;
        this.resultsVisible = true;
        
        // Bloquear el desplazamiento de la página
        const scrollY = window.scrollY;
        window.onscroll = () => {
          window.scrollTo(0, scrollY);
        };
        
        this.noResultsFound = this.anime_results.length === 0;
        this.noResultsMessageDisplayed = this.noResultsFound;
      });
    } else {
      this.handleEmptyInput();
    }
  }
  
  // Manejar el input vacío y mostrar animación de sacudida
  handleEmptyInput() {
    this.inputEmpty = true;
    this.searchCompleted = false;
    
    const placeholder = document.querySelector('input[name="search"]') as HTMLInputElement;
    placeholder.classList.add("shake-placeholder");
    
    setTimeout(() => {
      placeholder.classList.remove("shake-placeholder");
    }, 500);
  }
  
  // Limpiar input de búsqueda
  clearInput() {
    if (this.searchTerm === "") {
      this.triggerShakeAnimation();
    } else {
      this.searchTerm = "";
    }
  }
  
  // Activar animación de sacudida del placeholder
  triggerShakeAnimation() {
    const placeholder = document.querySelector('input[name="search"]') as HTMLInputElement;
    placeholder.classList.add("shake-placeholder");
    
    setTimeout(() => {
      placeholder.classList.remove("shake-placeholder");
    }, 500);
  }
  
  // Alternar visibilidad del contenedor de resultados
  toggleResultsContainer() {
    this.resultsVisible = !this.resultsVisible;
  }
  
  // Cerrar el contenedor de resultados con animación
  closeResultsContainer() {
    document.documentElement.style.overflowY = 'visible';
    if (this.resultsVisible) {
      this.animateClosing = true;
      window.onscroll = null;
      this.searchTerm = "";
      
      setTimeout(() => {
        this.resultsVisible = false;
        this.animateClosing = false;
        
        // Forzar el scroll hasta arriba del contenedor
        const resultsContainer = this.elRef.nativeElement.querySelector('.results-container');
        if (resultsContainer) {
          resultsContainer.scrollTop = 0;
        }
      }, 200);
    }
  }
  
  // Añadir un anime a la lista
  addAnime(anime: Anime) {
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
  
  // Manejar el desplazamiento del contenedor de resultados
  onContainerScroll = (event: Event) => {
    this.updateProgressBar();
  }
  
  // Actualizar la barra de progreso del contenedor de resultados
  updateProgressBar() {
    const container = this.resultsContainer.nativeElement;
    const winScroll = container.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
    const height = container.scrollHeight - container.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const myBar = document.getElementById("myBar");
    
    if (myBar) {
      myBar.style.width = scrolled + "%";
    }
  }
}