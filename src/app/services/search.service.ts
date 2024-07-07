import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable().pipe(
    debounceTime(300)
  );
  
  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }
}