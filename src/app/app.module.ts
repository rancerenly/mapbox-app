import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MapboxModule} from "./mapbox/mapbox.module";
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapboxModule,
    HttpClientModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
