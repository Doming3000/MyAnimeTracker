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
  
  constructor(private http: HttpClient) { }
  
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
  
  addResultAnime(anime: Anime[]) {
    this.anime_response$.next(anime);
  }
  
  getResultAnime(): Observable<Anime[]> {
    return this.anime_response$.asObservable();
  }
  
  animeSelected(anime: MyAnime) {
    this.anime_selected$.next(anime);
  }
  
  getAnimeSelected(): Observable<MyAnime> {
    return this.anime_selected$.asObservable();
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error('Ha ocurrido un error:', errorMessage);
    return throwError(errorMessage);
  }
}