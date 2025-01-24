import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
import { Anime, APIAnime, MyAnime } from '../interfaces/api-movies';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alerts.service';

@Injectable({
  providedIn: 'root'
})

export class AnimeService {
  private API_URL = 'https://api.jikan.moe/v4/anime?q=';
  private cache: { [key: string]: Anime[] } = {};
  
  // Almacén de la lista de animes seleccionados
  private myAnimes: MyAnime[] = [];
  private myAnimes$ = new Subject<MyAnime[]>();
  
  constructor(private http: HttpClient, private alertService: AlertService) {
    // Restaurar la lista desde localStorage si existe
    const savedList = localStorage.getItem('myAnimes');
    if (savedList) {
      this.myAnimes = JSON.parse(savedList);
    }
  }
  
  // Obtener animes desde la API al realizar una búsqueda
  getAnimes(searchTerm: string): Observable<APIAnime> {
    if (this.cache[searchTerm]) {
      return of({ data: this.cache[searchTerm] } as APIAnime);
    }
    return this.http.get<APIAnime>(`${this.API_URL}${searchTerm}`).pipe(
      tap(result => {
        this.cache[searchTerm] = result.data;
      }),
      catchError(this.handleError)
    );
  }
  
  // Manejo de la lista
  addToList(anime: MyAnime): void {
    const exists = this.myAnimes.some((existingAnime) => existingAnime.id === anime.id);
    if (exists) {
      this.alertService.triggerAlert('error', 'Error!', 'Este elemento ya está en tu lista.');
    } else {
      this.alertService.triggerAlert('success', 'Hecho!', 'Añadido a tu lista.');
      this.myAnimes.push(anime);
      this.myAnimes$.next(this.myAnimes); 
      localStorage.setItem('myAnimes', JSON.stringify(this.myAnimes));
    }
  }
  
  removeFromList(animeId: number): void {
    this.myAnimes = this.myAnimes.filter((anime) => anime.id !== animeId);
    this.myAnimes$.next(this.myAnimes);
    localStorage.setItem('myAnimes', JSON.stringify(this.myAnimes));
  }
  
  getList$(): Observable<MyAnime[]> {
    return this.myAnimes$.asObservable();
  }
  
  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}