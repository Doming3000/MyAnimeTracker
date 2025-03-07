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
  selectedAnime: MyAnime | null = null;
  categorizedAnime: { title: string; list: MyAnime[] }[] = [];
  
  // Inyección de dependencias
  constructor(private animeService: AnimeService, private alertService: AlertService) { }
  
  ngOnInit() {
    // Cargar datos iniciales desde el almacenamiento local
    this.loadMyAnimeList();
    
    // Suscribirse a los cambios en el servicio
    this.animeService.getList$().subscribe((list) => {
      this.animes = list;
      this.sortAnimeList();
    });
  }
  
  // Cargar lista de elementos desde el almacenamiento local
  loadMyAnimeList() {
    const storedData = localStorage.getItem('myAnimes');
    if (storedData) {
      this.animes = JSON.parse(storedData) || [];
      this.animes.forEach(anime => anime.isModalOpen = false); 
      this.sortAnimeList();
    }
  }
  
  // Aumentar o disminuir el número de episodios vistos
  updateWatchCount(anime: MyAnime, change: number, event?: MouseEvent) {
    const step = event?.ctrlKey ? 10 : 1;
    anime.watchedEpisodes = Math.max(0, Math.min((anime.totalEpisodes || Infinity), anime.watchedEpisodes + change * step));
    this.animeService.updateAnimeList(this.animes);
  }
  
  // Marcar anime como visto o no visto
  ViewAnime(anime: MyAnime) {
    anime.markedAsViewed = !anime.markedAsViewed;
    this.animeService.updateAnimeList(this.animes);
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
  
  openSettings() {
    this.alertService.triggerAlert('error', 'Proximamente!', 'lorem Ipsum dolor sit amet');
  }
  
  // Eliminar un anime de la lista
  DelAnime(anime: MyAnime) {
    this.alertService.triggerConfirm({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar <span class="animeTitle">${anime.title}</span> de tu lista?`,
      yesText: 'Sí, quiero eliminarlo',
      noText: 'No, cambié de opinión',
      callback: () => {
        this.alertService.triggerAlert('success', 'Hecho!', 'Elemento eliminado con éxito.');
        this.animes = this.animes.filter(an => an.id !== anime.id);
        this.animeService.updateAnimeList(this.animes);
        this.animeService.removeFromList(anime.id); 
        this.sortAnimeList();
      }
    });
  }
  
  // Acortar el nombre del anime
  truncateAnimeName(name: string, maxLength: number): string {
    return name.length <= maxLength ? name : `${name.substr(0, maxLength - 3)}...`;
  }
  
  // Ordenar la lista de animes
  private sortAnimeList() {
    // Ordenar alfabéticamente y por estado
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
    
    // Agregar categorías a la lista de animes
    this.categorizedAnime = [
      { title: 'Viendo', list: this.animes.filter(anime => anime.watchedEpisodes > 1 && !anime.markedAsViewed) },
      { title: 'En espera', list: this.animes.filter(anime => anime.watchedEpisodes === 0 && !anime.markedAsViewed) },
      { title: 'Terminado', list: this.animes.filter(anime => anime.markedAsViewed) }
    ];
  }
}