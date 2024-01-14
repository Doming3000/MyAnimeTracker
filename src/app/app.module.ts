import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modulos
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Componentes
import { AppComponent } from './app.component';
import { SearchResultsAnimeComponent } from './components/searchresults-anime/searchresults-anime.component';
import { MylistAnimeComponent } from './components/mylist-anime/mylist-anime.component';
import { WebDataAnimeComponent } from './components/webdata-anime/webdata-anime.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchResultsAnimeComponent,
    MylistAnimeComponent,
    WebDataAnimeComponent,
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