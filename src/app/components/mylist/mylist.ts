import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MyAnime } from 'src/app/interfaces/api-movies';
import { AnimeService } from 'src/app/services/anime.service';
import { AlertService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-mylist',
  templateUrl: './mylist.html',
  styleUrls: ['./mylist.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), transition(':enter', [ animate('600ms ease-in') ])
    ])
  ]
})

export class Mylist implements OnInit {  
  // Variables
  animes: MyAnime[] = [];
  isModalOpen = false;
  isListEmpty = true;
  selectedAnime: MyAnime | null = null;
  
  // Inyección de dependencias
  constructor(private animeService: AnimeService, private alertService: AlertService) { }
  
  ngOnInit() {
    // Cargar datos iniciales desde el almacenamiento local
    this.loadMyAnimeList();
    
    // Suscribirse a los cambios en el servicio
    this.animeService.getList$().subscribe((list) => {
      this.animes = list;
      this.isListEmpty = this.animes.length === 0;
    });
  }
  
  // Cargar lista de elementos desde el almacenamiento local
  loadMyAnimeList() {
    const storedData = localStorage.getItem('myAnimes');
    if (storedData) {
      this.animes = JSON.parse(storedData) || [];
      this.animes.forEach(anime => anime.isModalOpen = false); 
      this.isListEmpty = this.animes.length === 0;
      this.sortAnimeList();
    }
  }
  
  // Aumentar el número de episodios vistos
  increaseWatch(anime: MyAnime, event: MouseEvent) {
    const increment = event.ctrlKey ? 10 : 1;
    
    if (anime.watchedEpisodes + increment <= (anime.totalEpisodes || Infinity)) {
      anime.watchedEpisodes += increment;
    } else {
      anime.watchedEpisodes = anime.totalEpisodes || anime.watchedEpisodes;
    }
    this.updateLocalStorage();
  }
  
  // Disminuir el número de episodios vistos
  decreaseWatch(anime: MyAnime, event: MouseEvent) {
    if (event.ctrlKey) {
      anime.watchedEpisodes = Math.max(anime.watchedEpisodes - 10, 0);
    } else {
      anime.watchedEpisodes = Math.max(anime.watchedEpisodes - 1, 0);
    }
    this.updateLocalStorage();
  }
  
  // Marcar anime como visto o no visto
  ViewAnime(anime: MyAnime) {
    anime.markedAsViewed = !anime.markedAsViewed;
    this.updateLocalStorage();
  }
  
  // Abrir modal y overlay
  openDetails(anime: MyAnime) {
    this.selectedAnime = anime;
    this.isModalOpen = true;
  }
  
  closeDetails() {
    this.selectedAnime = null;
    this.isModalOpen = false;
  }
  
  // Eliminar un anime de la lista
  DelAnime(anime: MyAnime) {
    this.alertService.triggerConfirm({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar <span class="animeTitle">${anime.title}</span> de tu lista?`,
      yesText: 'Sí, quiero eliminarlo',
      noText: 'No, cambié de opinión',
      callback: () => {
        this.animes = this.animes.filter(an => an.id !== anime.id);
        this.animeService.removeFromList(anime.id); 
        this.updateLocalStorage();
        this.alertService.triggerAlert('success', 'Hecho!', 'Elemento eliminado con éxito.');
      }
    });
  }
  
  // Acortar el nombre del anime
  truncateAnimeName(name: string, maxLength: number): string {
    return name.length <= maxLength ? name : `${name.substr(0, maxLength - 3)}...`;
  }
  
  // Ordenar la lista de animes por nombre y estado
  private sortAnimeList() {
    this.animes.sort((a, b) => {
      if (!a.markedAsViewed && b.markedAsViewed) {
        return -1;
      }
      
      else if (a.markedAsViewed && !b.markedAsViewed) {
        return 1;
      }
      
      else {
        return a.title.localeCompare(b.title);
      }
    });
  }
  
  // Actualizar el almacenamiento local con la lista de animes
  private updateLocalStorage() {
    localStorage.setItem('myAnimes', JSON.stringify(this.animes));
    this.isListEmpty = this.animes.length === 0;
    // Revisar esto después, quizás sea mejor no reordenar de forma dinámica.
    // this.sortAnimeList();
  }
}