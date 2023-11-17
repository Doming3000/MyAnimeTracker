import { Component, OnDestroy, OnInit, Input, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { Anime, MyAnime } from "src/app/interfaces/api-movies";
import { AnimeService } from "src/app/services/anime.service";

@Component({
  selector: "app-results-anime",
  templateUrl: "./results-anime.component.html",
  styleUrls: ["./results-anime.component.css"],
})
export class ResultsAnimeComponent implements OnInit, OnDestroy {
  @Input() searchClicked: EventEmitter<void> | undefined;
  anime_results: any[] = [];
  animeSuscription!: Subscription;
  noResultsFound: boolean = false;
  isModalVisible = false;
  
  constructor(private animeService: AnimeService) {}
  
  ngOnInit(): void {
    if (this.searchClicked) {
      this.searchClicked.subscribe(() => {
        this.openModal();
      });
    }
    
    this.animeSuscription = this.animeService.getResultAnime().subscribe((result) => {
      this.anime_results = result;
      this.noResultsFound = this.anime_results.length === 0;
      this.isModalVisible = true;
    });
  }
  
  ngOnDestroy(): void {
    this.animeSuscription.unsubscribe();
  }
  
  openModal() {
    this.isModalVisible = true;
  }
  
  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.isModalVisible = false;
      this.anime_results = [];
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
      link: '',
    };
    
    this.animeService.animeSelected(addAnime);
    this.isModalVisible = false;
    this.anime_results = [];
  }
}