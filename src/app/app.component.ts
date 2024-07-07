import { Component } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'anime';
  showMyList = true;
  showResults = false;
  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateComponentVisibility(event.url);
    });
  }
  
  private updateComponentVisibility(url: string): void {
    const hasSearchTerm = this.route.snapshot.queryParams['term'];
    this.showResults = !!hasSearchTerm;
    this.showMyList = !hasSearchTerm;
  }
}