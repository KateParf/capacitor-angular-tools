import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { SafeHtmlPipe } from './pipes/keep-html.pipe';
import {MatDialogModule} from "@angular/material";

import { AppComponent } from './app.component';
import { HomeComponent } from './Pages/home/home.component';

import { AutoUpdateComponent } from './Pages/autoupdate/autoupdate.component';
import { BiometricAuthComponent } from './Pages/biometricauth/biometricauth.component';
import { NFCComponent } from './Pages/nfc/nfc.component';
import { BytesToHexPipe } from './Pages/nfc/bytes-to-hex.pipe';
import { RecordPayloadPipe } from './Pages/nfc/record-payload';


@NgModule({
  declarations: [
    SafeHtmlPipe,
    AppComponent,
    HomeComponent,
    AutoUpdateComponent, 
    BiometricAuthComponent, 
    NFCComponent, 
    BytesToHexPipe, 
    RecordPayloadPipe,
    CourseDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,

    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'biometricauth', component: BiometricAuthComponent },
      { path: 'nfc', component: NFCComponent },
      { path: 'autoupdate', component: AutoUpdateComponent },

    ]),
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'ru'
  }],
  bootstrap: [AppComponent],
  entryComponents: [CourseDialogComponent]
})
export class AppModule { }
