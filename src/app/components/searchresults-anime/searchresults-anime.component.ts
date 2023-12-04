import { Anime, MyAnime } from "src/app/interfaces/api-movies";
import { AnimeService } from "src/app/services/anime.service";
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-searchresults-anime",
  templateUrl: "./searchresults-anime.component.html",
  styleUrls: ["./searchresults-anime.component.css"],
})

export class SearchResultsAnimeComponent implements OnInit, AfterViewInit {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;
  
  animateClosing: boolean = false; 
  anime_results: any[] = [];
  animeSuscription!: Subscription;
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
      this.searchForm = this.formBuilder.group({
        searchTerm: ["", Validators.required],
      });
    }
    
    ngAfterViewInit(): void {
      this.resultsContainer.nativeElement.addEventListener('scroll', this.onContainerScroll);
    }
    
    ngOnInit(): void {
      this.animeSuscription = this.animeService
      .getResultAnime()
      .subscribe((result) => {
        this.anime_results = result;
      });
    }
    
    ngOnDestroy(): void {
      this.animeSuscription.unsubscribe();
    }
    
    // Búsqueda
    search() {
      if (this.searchTerm.trim() !== "") {
        document.body.style.cursor = "progress";
        
        this.animeService.getAnimes(this.searchTerm).subscribe((result) => {
          document.body.style.cursor = "default";
          this.anime_results = result.data;
          this.searchTerm = "";
          this.resultsVisible = true;
          
          if (this.anime_results.length > 0) {
            this.noResultsFound = false;
            this.noResultsMessageDisplayed = false;
          } else {
            this.noResultsFound = true;
            if (!this.noResultsMessageDisplayed) {
              this.noResultsMessageDisplayed = true;
            }
          }
        });
      } else {
        this.inputEmpty = true;
        this.searchCompleted = false;
        
        const placeholder = document.querySelector(
          'input[name="search"]'
          ) as HTMLInputElement;
          placeholder.classList.add("shake-placeholder");
          
          setTimeout(() => {
            placeholder.classList.remove("shake-placeholder");
          }, 500);
        }
      }
      
      // Metodos para manejar el cierre del contenedor de resultados
      toggleResultsContainer() {
        this.resultsVisible = !this.resultsVisible;
      }
      
      closeResultsContainer() {
        if (this.resultsVisible) {
          this.animateClosing = true;
          
          setTimeout(() => {
            // Establece el estado de apertura/cierre después de la animación o el tiempo de espera
            this.resultsVisible = false; // Cierra el contenedor
            this.animateClosing = false;
            
            // Formzar el scroll hasta arriba del contenedor
            const resultsContainer = this.elRef.nativeElement.querySelector('.results-container');
            if (resultsContainer) {
              resultsContainer.scrollTop = 0;
            }
          }, 200);
        }
      }
      
      // Añadir a la lista
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
      
      // Efecto de desplazamiento de la barra de progreso del contenedor de resultados
      onContainerScroll = (event: Event) => {
        this.myFunction();
      }
      
      myFunction() {
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