import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { RequestService } from './request.service';

@NgModule({
  declarations: [AppComponent, DetailsComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [RequestService],
  bootstrap: [AppComponent],
})
export class AppModule {}
