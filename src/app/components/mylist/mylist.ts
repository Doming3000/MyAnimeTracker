import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MyAnime } from 'src/app/interfaces/api-movies';
import { AnimeService } from 'src/app/services/anime.service';
import { AlertService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-mylist',
  templateUrl: './mylist.html',
  styleUrls: ['./mylist.css']
})

export class Mylist implements OnInit {  
  // Variables
  selectedAnime: MyAnime | null = null;
  animes_selected: MyAnime[] = [];
  isModalOpen = false;
  isListEmpty = true;
  
  // Inyección de dependencias
  constructor(private animeService: AnimeService, private alertService: AlertService) { }
  
  ngOnInit(): void {
    this.loadMyAnimeList();
    this.animeService.getAnimeSelected().subscribe(anime => {
      this.addAnimeToMyList(anime);
    });
  }
  
  // Cargar lista de elementos desde el almacenamiento local
  loadMyAnimeList() {
    const storedData = localStorage.getItem('my_anime');
    if (storedData) {
      this.animes_selected = JSON.parse(storedData) || [];
      this.animes_selected.forEach(anime => anime.isModalOpen = false); 
      this.isListEmpty = this.animes_selected.length === 0;
      this.sortAnimeList();
    }
  }
  
  // Agregar un elemento a la lista
  addAnimeToMyList(anime: MyAnime) {
    if (this.isAnimeSelected(anime)) {
      this.alertService.triggerAlert('error', 'Error!', 'Este elemento ya está en tu lista.');
    } else {
      this.alertService.triggerAlert('success', 'Hecho!', 'Añadido a tu lista.');
      this.animes_selected.push(anime);
      this.updateLocalStorage();
      anime.isModalOpen = false;
    }
  }
  
  // Verificar si el elemento ya está en la lista
  private isAnimeSelected(anime: MyAnime): boolean {
    return this.animes_selected.some(selectedAnime => selectedAnime.id === anime.id);
  }
  
  // Aumentar el número de episodios vistos
  increaseWatch(anime: MyAnime, event: MouseEvent) {
    const increment = event.ctrlKey ? 10 : 1;
    
    if (anime.watched_episodes + increment <= (anime.total_episodes || Infinity)) {
      anime.watched_episodes += increment;
    } else {
      anime.watched_episodes = anime.total_episodes || anime.watched_episodes;
    }
    this.updateLocalStorage();
  }
  
  // Disminuir el número de episodios vistos
  decreaseWatch(anime: MyAnime, event: MouseEvent) {
    if (event.ctrlKey) {
      anime.watched_episodes = Math.max(anime.watched_episodes - 10, 0);
    } else {
      anime.watched_episodes = Math.max(anime.watched_episodes - 1, 0);
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
        this.animes_selected = this.animes_selected.filter(an => an.id !== anime.id);
        this.updateLocalStorage();
        this.alertService.triggerAlert('success', 'Hecho!', 'Elemento eliminado con éxito.');
      }
    });
  }
  
  // Acortar el nombre del anime
  truncateAnimeName(name: string, maxLength: number): string {
    return name.length <= maxLength ? name : `${name.substr(0, maxLength - 3)}...`;
  }
  
  // Objetener cantidad de episodios para ajustar estilos css
  // getEpisodeCountClass(anime: any): string {
  //   if (anime.total_episodes == null) {
  //     return 'noDigits';
  //   }
  
  //   const totalEpisodesLength = anime.total_episodes.toString().length;
  
  //   if (totalEpisodesLength === 1) {
  //     return 'oneDigit';
  //   } else if (totalEpisodesLength === 2) {
  //     return 'twoDigits';
  //   } else if (totalEpisodesLength === 3) {
  //     return 'threeDigits';
  //   } else if (totalEpisodesLength >= 4) {
  //     return 'fourDigits';
  //   }
  
  //   return '';
  // }
  
  // Ordenar la lista de animes por nombre y estado
  private sortAnimeList() {
    this.animes_selected.sort((a, b) => {
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
    localStorage.setItem('my_anime', JSON.stringify(this.animes_selected));
    this.isListEmpty = this.animes_selected.length === 0;
    // Revisar esto después, quizás sea mejor no reordenar de forma dinámica.
    // this.sortAnimeList();
  }
}