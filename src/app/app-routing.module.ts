import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { Mylist } from './components/mylist/mylist';
import { SearchResults } from './components/searchresults/searchresults';

const routes: Routes = [
  { path: '', component: Mylist }, 
  { path: 'searchresults', component: SearchResults },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }