import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Módulo para peticiones HTTP
import { ReactiveFormsModule } from '@angular/forms'; // Módulo para formularios reactivos

import { AppComponent } from './app.component';
import { ColaboradoresComponent } from './components/colaboradores/colaboradores.component';

@NgModule({
  declarations: [
    AppComponent,
    ColaboradoresComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }