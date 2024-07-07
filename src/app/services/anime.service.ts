import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
import { Anime, APIAnime, MyAnime } from '../interfaces/api-movies';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AnimeService {
  private API_URL = 'https://api.jikan.moe/v4/anime?q=';
  private cache: { [key: string]: Anime[] } = {};
  
  private anime_response$ = new Subject<Anime[]>();
  private anime_selected$ = new Subject<MyAnime>();
  
  // Inyección de dependencias
  constructor(private http: HttpClient) { }
  
  // Obtener animes desde la API según el término de búsqueda
  getAnimes(searchTerm: string): Observable<APIAnime> {
    // Verificar si el resultado ya está en caché
    if (this.cache[searchTerm]) {
      return of({ data: this.cache[searchTerm] } as APIAnime);
    }
    
    // Hacer la solicitud HTTP y almacenar el resultado en caché
    return this.http.get<APIAnime>(`${this.API_URL}${searchTerm}`).pipe(
      tap(result => {
        this.cache[searchTerm] = result.data;
      }),
      catchError(this.handleError)
    );
  }
  
  // Emitir los resultados de la búsqueda de anime
  addResultAnime(anime: Anime[]) {
    this.anime_response$.next(anime);
  }
  
  // Obtener el observable de los resultados de búsqueda de anime
  getResultAnime(): Observable<Anime[]> {
    return this.anime_response$.asObservable();
  }
  
  // Emitir el anime seleccionado
  animeSelected(anime: MyAnime) {
    this.anime_selected$.next(anime);
  }
  
  // Obtener el observable del anime seleccionado
  getAnimeSelected(): Observable<MyAnime> {
    return this.anime_selected$.asObservable();
  }
  
  // Manejo de errores en las solicitudes HTTP
  private handleError(error: HttpErrorResponse) {
    if (error.status === 429) {
      console.error('Has excedido el límite de solicitudes permitidas. Por favor, inténtalo más tarde.');
    } else {
      console.error('Ha ocurrido un error:', error.message);
    }
    return throwError('Por favor, inténtalo más tarde.');
  }
}