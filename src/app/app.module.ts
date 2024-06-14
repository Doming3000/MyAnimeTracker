import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modulos
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Componentes
import { AppComponent } from './app.component';
import { SearchResults } from './components/searchresults/searchresults';
import { Mylist } from './components/mylist/mylist';
import { SideNav } from './components/sidenav/sidenav';
import { WebAlerts } from './components/webalerts/web-alerts';

@NgModule({
  declarations: [
    AppComponent,
    SearchResults,
    Mylist,
    SideNav,
    WebAlerts,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }