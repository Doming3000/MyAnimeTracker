import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { Home } from './components/home/home';
import { Mylist } from './components/mylist/mylist';
import { SearchResults } from './components/searchresults/searchresults';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'mylist', component: Mylist },
  { path: 'searchresults', component: SearchResults },
  { path: '**', redirectTo: '' }, // Ruta comodín para redirigir a Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }