import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importa o Interceptor
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// === INÍCIO DA ATUALIZAÇÃO SPRINT 03 (Calendário) ===
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Registra a localidade "pt-BR"
registerLocaleData(localePt);
// === FIM DA ATUALIZAÇÃO SPRINT 03 (Calendário) ===

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMaskModule.forRoot(),
    // === INÍCIO DA ATUALIZAÇÃO SPRINT 03 (Calendário) ===
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
    // === FIM DA ATUALIZAÇÃO SPRINT 03 (Calendário) ===
  ],
  providers: [
    // Registra o Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

