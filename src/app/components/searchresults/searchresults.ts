import { Anime, MyAnime } from "src/app/interfaces/api-movies";
import { AnimeService } from "src/app/services/anime.service";
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: "app-searchresults",
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
  
  searchTermSubscription!: Subscription;
  
  constructor(
    private animeService: AnimeService,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
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
    this.searchTermSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.search(term);
    });
    
    this.animeSubscription = this.animeService.getResultAnime().subscribe(result => {
      this.anime_results = result;
    });
  }
  
  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
    this.animeSubscription.unsubscribe();
  }
  
  search(term: string) {
    if (term.trim() !== '') {
      document.body.style.cursor = "progress";
      document.documentElement.style.overflowY = 'hidden';
      
      this.animeService.getAnimes(term).subscribe(result => {
        document.body.style.cursor = "default";
        this.anime_results = result.data;
        this.resultsVisible = true;
        
        const scrollY = window.scrollY;
        window.onscroll = () => {
          window.scrollTo(0, scrollY);
        };
        
        this.noResultsFound = this.anime_results.length === 0;
        this.noResultsMessageDisplayed = this.noResultsFound;
      });
    } else {
      this.inputEmpty = true;
      this.searchCompleted = false;
      this.searchService.updateSearchTerm("");
    }
  }
  
  toggleResultsContainer() {
    this.resultsVisible = !this.resultsVisible;
  }
  
  closeResultsContainer() {
    document.documentElement.style.overflowY = 'visible';
    if (this.resultsVisible) {
      this.animateClosing = true;
      window.onscroll = null;
      this.searchTerm = "";
      this.searchService.updateSearchTerm("");
      
      setTimeout(() => {
        this.resultsVisible = false;
        this.animateClosing = false;
        
        const resultsContainer = this.elRef.nativeElement.querySelector('.results-container');
        if (resultsContainer) {
          resultsContainer.scrollTop = 0;
        }
      }, 200);
    }
  }
  
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
  
  onContainerScroll = (event: Event) => {
    this.updateProgressBar();
  }
  
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
