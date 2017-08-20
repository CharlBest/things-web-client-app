import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpService } from './shared/http.service';
import { ThingsController, UserController, PostController } from 'api-typings/bundle';
import { LayoutModule } from 'app/layout/layout.module';
import { AuthService } from 'app/shared/auth.service';
import { PublicThingService } from 'app/shared/public-thing.service';
import { FormService } from 'app/shared/form.service';
import { TutorialService } from 'app/tutorial/tutorial.service';
import { GaService } from 'app/shared/ga.service';
import { LoggerService } from 'app/shared/logger.service';
// import { LoggingService } from './shared/logging.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    LayoutModule,
    BrowserAnimationsModule
  ],
  providers: [
    ThingsController,
    UserController,
    PostController,
    HttpService,
    Title,
    AuthService,
    PublicThingService,
    FormService,
    TutorialService,
    GaService,
    LoggerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
