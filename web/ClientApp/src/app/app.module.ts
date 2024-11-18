import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal'; 
import { AccordionModule } from 'ngx-bootstrap/accordion' 
import { NgxIndexedDBModule } from 'ngx-indexed-db';

import { AppComponent } from './app.component';

import { HomeComponent } from './Pages/home/home.component';
import { AutoUpdateComponent } from './Pages/autoupdate/autoupdate.component';
import { BackgroundTaskComponent } from './Pages/backgroundtask/backgroundtask.component';
import { BiometricAuthComponent } from './Pages/biometricauth/biometricauth.component';
import { NFCComponent } from './Pages/nfc/nfc.component';
import { BytesToHexPipe } from './Pages/nfc/bytes-to-hex.pipe';
import { RecordPayloadPipe } from './Pages/nfc/record-payload';
import { dbConfig } from './Pages/backgroundtask/dbConfig';

@NgModule({
  declarations: [    
    AppComponent,
    HomeComponent,
    AutoUpdateComponent, 
    BackgroundTaskComponent,
    BiometricAuthComponent, 
    NFCComponent,
    BytesToHexPipe, 
    RecordPayloadPipe,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    ModalModule.forRoot(),  
    HttpClientModule,
    ReactiveFormsModule,   
    AccordionModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig),

    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'biometricauth', component: BiometricAuthComponent },
      { path: 'nfc', component: NFCComponent },
      { path: 'autoupdate', component: AutoUpdateComponent },
      { path: 'backgroundtask', component: BackgroundTaskComponent },
    ]),
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'ru',
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
