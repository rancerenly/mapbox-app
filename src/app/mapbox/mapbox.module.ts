import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxComponent } from './components/mapbox.component';
import {RouterModule, Routes} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";


const routes: Routes = [
  {
    path: '',
    component: MapboxComponent
  }
];
@NgModule({
  declarations: [
    MapboxComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class MapboxModule { }
