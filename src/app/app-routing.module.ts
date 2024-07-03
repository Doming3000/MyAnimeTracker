import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { Newpage } from './newpage/newpage';
import { Mylist } from './components/mylist/mylist';

const routes: Routes = [
  { path: '', component: Mylist }, 
  { path: 'newpage', component: Newpage }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }