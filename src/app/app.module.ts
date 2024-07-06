import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Modulos
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Componentes
import { AppComponent } from './app.component';
import { SearchResults } from './components/searchresults/searchresults';
import { Mylist } from './components/mylist/mylist';
import { Navigation } from './components/navigation/navigation';
import { Alerts } from './components/alerts/alerts';
import { Newpage } from './components/newpage/newpage';

@NgModule({
  declarations: [
    AppComponent,
    SearchResults,
    Mylist,
    Navigation,
    Alerts,
    Newpage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }