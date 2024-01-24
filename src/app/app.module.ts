import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { HttpClientModule } from '@angular/common/http';
registerLocaleData(localeAr);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers:[DatePipe,{ provide: LOCALE_ID, useValue: 'ar' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
