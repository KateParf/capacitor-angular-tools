import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import versionJson from '../../../../package.json';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-autoupdate',
  templateUrl: './autoupdate.component.html'
})

export class AutoUpdateComponent {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    @Inject(DOCUMENT) private document: Document,
    route: ActivatedRoute,
    private renderer: Renderer2) { }

  public url: string | undefined;
  urlForm = new FormGroup({
    "URL": new FormControl("",
      [Validators.required,
      Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
      ])
  });

  onSubmit() {
    this.url = this.urlForm.value.URL?.toString() == undefined ? '' : this.urlForm.value.URL?.toString();
    localStorage.setItem('serverUrl', this.url);
    console.log(this.url, localStorage.getItem('serverUrl'));
  }

  currentVersion: string = ''; // тек вер клиента
  accessibleVersions: string[] = []; // все версии на сервере 
  updateFlag: boolean = false; // флаг нужно ли показывать кнопки со скачиванием версий

  private getCurVer() {
    console.log("load current version ");
    console.log("Current ver on web: ", versionJson.version);
    return versionJson.version;
  }

  checkForUpdate() {
    // читать json файл с версией клиента
    this.currentVersion = this.getCurVer();
    // выполнять HTTP-запрос к серверу, чтобы проверить наличие обновлений
    console.log("load server version ");
    this.http.get<string[]>(this.baseUrl + 'api/autoupdate/').subscribe(result => {
      this.accessibleVersions = result;
      console.log("Last ver on server: ", this.accessibleVersions[this.accessibleVersions.length - 1]);
      // вызываем кнопки скачивания версий с сервера
      this.updateFlag = true;
    }, error => console.error(error));
  }

  update(ver: string) {
    console.log("update to ver", ver);


    let data = { version: ver }
    CapacitorUpdater.notifyAppReady()
    App.addListener('appStateChange', async (state) => {
      if (state.isActive) {
        // Do the download during user active app time to prevent failed download
        data = await CapacitorUpdater.download({
          version: '0.0.4',
          url: 'https://github.com/Cap-go/demo-app/releases/download/0.0.4/dist.zip',
        })
      }
      if (!state.isActive && data.version !== "") {
        // Do the switch when user leave app
        SplashScreen.show()
        try {
          let data = {id: ver}
          await CapacitorUpdater.set(data)
        } catch (err) {
          console.log(err)
          SplashScreen.hide() // in case the set fail, otherwise the new app will have to hide it
        }
      }
    })

  }

}



