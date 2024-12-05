import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ImagesComponent } from './images/images.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { EditImageComponent } from './images/edit-image/edit-image.component';
import { ViewImageComponent } from './images/view-image/view-image.component';
import { DeleteImageComponent } from './images/delete-image/delete-image.component';

@NgModule({
  declarations: [
    AppComponent,
    ImagesComponent,
    HeaderComponent,
    EditImageComponent,
    ViewImageComponent,
    DeleteImageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
