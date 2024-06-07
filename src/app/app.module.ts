import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modulos
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Componentes
import { AppComponent } from './app.component';
import { SearchResults } from './components/searchresults-anime/searchresults';
import { Mylist } from './components/mylist-anime/mylist';
import { WebData } from './components/webdata-anime/webdata';

@NgModule({
  declarations: [
    AppComponent,
    SearchResults,
    Mylist,
    WebData,
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