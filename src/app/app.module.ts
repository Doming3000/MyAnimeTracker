import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modulos
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Componentes
import { AppComponent } from './app.component';
import { SearchAnimeComponent } from './components/searchresults-anime/searchresults-anime.component';
import { MylistAnimeComponent } from './components/mylist-anime/mylist-anime.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchAnimeComponent,
    MylistAnimeComponent,
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
