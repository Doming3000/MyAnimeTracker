import { Component, OnInit, ViewChild } from '@angular/core';
import { MyAnime } from 'src/app/interfaces/api-movies';
import { AnimeService } from 'src/app/services/anime.service';
import { WebAlerts } from '../webalerts/web-alerts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mylist-anime',
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
      
      // Actualizar la propiedad isListEmpty
      this.isListEmpty = this.animes_selected.length === 0;
      
      // Ordenar lista por orden alfabético y por estado
      this.animes_selected.sort((a, b) => {
        if (!a.markedAsViewed && b.markedAsViewed) {
          return -1;
        } else if (a.markedAsViewed && !b.markedAsViewed) {
          return 1;
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    }
  }
  
  // Agregar un elemento a la lista
  addAnimeToMyList(anime: MyAnime) {
    // Verificar si el elemento ya existe en la lista
    if (this.isAnimeSelected(anime)) {
      this.triggerErrorAlert('Oops!', 'Este elemento ya está en tu lista');
    }
    
    else {
      this.triggerSuccessAlert('Hecho!', 'Añadido a tu lista');
      
      // Añadir y actualizar el almacenamiento local
      this.animes_selected.push(anime);
      localStorage.setItem('my_anime', JSON.stringify(this.animes_selected));
      
      // Actualizar la propiedad isListEmpty después de añadir
      this.isListEmpty = this.animes_selected.length === 0;
      
      // Ordenar lista por orden alfabético y por estado
      this.animes_selected.sort((a, b) => {
        if (!a.markedAsViewed && b.markedAsViewed) {
          return -1;
        } else if (a.markedAsViewed && !b.markedAsViewed) {
          return 1;
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    }
  }
  
  // Verificar si el elemento ya está en la lista
  private isAnimeSelected(anime: MyAnime): boolean {
    return this.animes_selected.some((selectedAnime) => selectedAnime.id === anime.id);
  }
  
  // Botones para contar capítulos:
  increaseWatch(anime: MyAnime) {
    anime.watched_episodes++;
    this.updateLocalStorage();
  }
  
  decreaseWatch(anime: MyAnime) {
    anime.watched_episodes--;
    this.updateLocalStorage();
  }
  
  // Marcar anime como visto
  ViewAnime(anime: MyAnime) {
    anime.markedAsViewed = !anime.markedAsViewed;
    this.updateLocalStorage();
  }
  
  // Botón para editar enlace del elemento
  async EditAnime(anime: MyAnime) {
    const { value: url } = await Swal.fire({
      title: 'title',
      text: 'text',
      input: 'url',
      inputLabel: 'Añade una url',
      inputPlaceholder: 'https://www3.animeflv.net/',
      confirmButtonText: `<i class="fa-solid fa-link"></i> Añadir`,
    });
    
    if (url) {
      anime.link = url;
      this.updateLocalStorage();
    }
  }
  
  // Método para redirigir a la URL del anime
  redirectToAnime(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
  
  // Alerta de confirmación de eliminación
  DelAnime(anime: MyAnime) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará este elemento de tu lista.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, quiero eliminarlo',
      cancelButtonText: 'No, cambié de opinión',
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.animes_selected.findIndex(an => an.id === anime.id);
        if (index !== -1) {
          this.animes_selected.splice(index, 1);
          
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
          Toast.fire({
            icon: "success",
            title: "Elemento eliminado con éxito"
          });
          // Actualizar el almacenamiento local después de eliminar
          this.updateLocalStorage();
          
          // Actualizar la propiedad isListEmpty después de eliminar
          this.isListEmpty = this.animes_selected.length === 0;
        }
      }
    });
  }
  
  // Función para acortar el nombre del elemento (En caso de sobreponerse a los botones)
  truncateAnimeName(name: string, maxLength: number): string {
    if (name.length <= maxLength) {
      return name;
    } else {
      return name.substr(0, maxLength - 3) + '...';
    }
  }
  
  // Actualizar el almacenamiento local con la lista de animes
  private updateLocalStorage() {
    localStorage.setItem('my_anime', JSON.stringify(this.animes_selected));
  }
  
  // Método para mostrar una alerta de éxito
  triggerSuccessAlert(title: string, message: string) {
    this.webalerts.showAlert('success', title, message);
  }
  
  // Método para mostrar una alerta de error
  triggerErrorAlert(title: string, message: string) {
    this.webalerts.showAlert('error', title, message);
  }
}