import { Component, OnInit, ViewChild } from '@angular/core';
import { MyAnime } from 'src/app/interfaces/api-movies';
import { AnimeService } from 'src/app/services/anime.service';
import { WebAlerts } from '../webalerts/web-alerts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mylist',
  templateUrl: './mylist.html',
  styleUrls: ['./mylist.css']
})
export class Mylist implements OnInit {
  @ViewChild(WebAlerts) webalerts!: WebAlerts;
  
  animes_selected: MyAnime[] = [];
  isListEmpty = true;
  
  constructor(private animeService: AnimeService) { }
  
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
      this.isListEmpty = this.animes_selected.length === 0;
      this.sortAnimeList();
    }
  }
  
  // Agregar un elemento a la lista
  addAnimeToMyList(anime: MyAnime) {
    if (this.isAnimeSelected(anime)) {
      this.triggerErrorAlert('Oops!', 'Este elemento ya está en tu lista');
    } else {
      this.triggerSuccessAlert('Hecho!', 'Añadido a tu lista');
      this.animes_selected.push(anime);
      this.updateLocalStorage();
    }
  }
  
  // Verificar si el elemento ya está en la lista
  private isAnimeSelected(anime: MyAnime): boolean {
    return this.animes_selected.some(selectedAnime => selectedAnime.id === anime.id);
  }
  
  // Aumentar el número de episodios vistos
  increaseWatch(anime: MyAnime) {
    anime.watched_episodes++;
    this.updateLocalStorage();
  }
  
  // Disminuir el número de episodios vistos
  decreaseWatch(anime: MyAnime) {
    anime.watched_episodes--;
    this.updateLocalStorage();
  }
  
  // Marcar anime como visto o no visto
  ViewAnime(anime: MyAnime) {
    anime.markedAsViewed = !anime.markedAsViewed;
    this.updateLocalStorage();
  }
  
  // Editar enlace del anime
  async EditAnime(anime: MyAnime) {
    const { value: url } = await Swal.fire({
      title: 'Editar URL',
      text: 'Añade una url',
      input: 'url',
      inputLabel: 'Añade una url',
      inputPlaceholder: 'https://www3.animeflv.net/',
      confirmButtonText: '<i class="fa-solid fa-link"></i> Añadir',
    });
    
    if (url) {
      anime.link = url;
      this.updateLocalStorage();
    }
  }
  
  // Redirigir a la URL del anime
  redirectToAnime(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
  
  // Eliminar un anime de la lista
  DelAnime(anime: MyAnime) {
    this.webalerts.showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      yesText: 'Sí, quiero eliminarlo',
      noText: 'No, cambié de opinión',
      callback: () => {
        this.animes_selected = this.animes_selected.filter(an => an.id !== anime.id);
        this.updateLocalStorage();
        this.triggerSuccessAlert('¡Eliminado!', 'El elemento fue eliminado con éxito.');
      }
    });
  }
  
  // Acortar el nombre del anime
  truncateAnimeName(name: string, maxLength: number): string {
    return name.length <= maxLength ? name : `${name.substr(0, maxLength - 3)}...`;
  }
  
  // Actualizar el almacenamiento local con la lista de animes
  private updateLocalStorage() {
    localStorage.setItem('my_anime', JSON.stringify(this.animes_selected));
    this.isListEmpty = this.animes_selected.length === 0;
    this.sortAnimeList();
  }
  
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
  
  // Mostrar alerta de éxito
  triggerSuccessAlert(title: string, message: string) {
    this.webalerts.showAlert('success', title, message);
  }
  
  // Mostrar alerta de error
  triggerErrorAlert(title: string, message: string) {
    this.webalerts.showAlert('error', title, message);
  }
}