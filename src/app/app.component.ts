import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'anime';
  showMyList = true;
  showNewPage = false;
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      // Esta logica debe revisarse más adelante
      this.showMyList = event.url !== '/newpage';
      this.showNewPage = event.url === '/newpage';
    });
  }
}