import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import versionJson from '../../../../package.json';
import { BundleInfo, BundleListResult, CapacitorUpdater } from '@capgo/capacitor-updater';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-autoupdate',
  templateUrl: './autoupdate.component.html'
})

export class AutoUpdateComponent {

  constructor(
    @Inject('BASE_URL') public baseUrl: string,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    route: ActivatedRoute,
    private renderer: Renderer2) { 

      //CapacitorUpdater.notifyAppReady(); //!! TODO - перенсти куда то на старт прила
  }

  public storedUrl: string | null = localStorage.getItem('serverUrl');

  urlForm = new FormGroup({
    "URL": new FormControl("",
      [Validators.required,
      Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
      ])
  });

  // обработчик кнопки сохранения введенного УРЛ сервера в стораж
  onStoreURL() {
    this.storedUrl = this.urlForm.value.URL?.toString() == null ? '' : this.urlForm.value.URL?.toString();
    localStorage.setItem('serverUrl', this.storedUrl);
    this.print("storing URL : " + this.storedUrl + " | " + localStorage.getItem('serverUrl'));
  }

  currentVersion: string = ''; // тек вер клиента
  accessibleVersions: string[] = []; // все версии на сервере 
  status: string = "";
  updateFlag: boolean = false; // флаг нужно ли показывать кнопки со скачиванием версий
  bundles: BundleInfo[] = [];

  private print(msg: any) {
    console.log(msg);
    this.status += "\n\n------\n\n" + msg;
  }

  private getCurVer() {
    this.print("Get current client version ...");
    this.print("Current client version: " + versionJson.version);
    return versionJson.version;
  }

  // обработчик кнопки [Check For Updates]
  async checkForUpdate() {
    // читать json файл с версией клиента
    this.currentVersion = this.getCurVer();

    this.print("list downloaded bundles ...");
    const list = await CapacitorUpdater.list();
    this.bundles = list.bundles;
    this.print(this.bundles);
    for (let i = 0; i < this.bundles.length; i++)
      this.print(this.bundles[i].version + " | " + this.bundles[i].downloaded);


    // выполнять HTTP-запрос к серверу, чтобы проверить наличие обновлений
    this.print("Load server version ...");

    const url = this.storedUrl + '/api/autoupdate';
    this.print("Request to url: " + url);

    this.http.get<string[]>(url).subscribe(result => {
      this.accessibleVersions = result;
      //писать отладку что запрос отправлен на урл такой-то
      this.print("Last ver on server: " + this.accessibleVersions[this.accessibleVersions.length - 1]);

      // вызываем кнопки скачивания версий с сервера
      this.updateFlag = true;
    }, error => console.error(error));
  }

  // обработчик кнопки - version xxx
  async update(ver: string) {
    this.print("update to ver: " + ver);

    const distFile = `/client-updates/${ver}/com.smsit.capacitordemo_${ver}.zip`;
    console.log('download', this.storedUrl + distFile);

    //------

    // Do the download during user active app time to prevent failed download
    this.print("downloading ...");
    const loadData = await CapacitorUpdater.download({
      version: ver,
      url: this.storedUrl + distFile,
    });
    
    this.print("[v] download finished.");
    this.print(loadData.version + " | id = " + loadData.id + " | status = " + loadData.status);

    this.print("start update app ...");
    ///SplashScreen.show();
    try {
      let dataUpd = { id: loadData.id }
      //!!! --- await CapacitorUpdater.next(dataUpd); // обновить при след старте
      await CapacitorUpdater.set(dataUpd); // обновить прям щас
      this.print("[v] update ok");

      await CapacitorUpdater.reload();
      
    } catch (err) {
      this.print("!!! update error:");
      this.print(err);
      ///SplashScreen.hide(); // in case the set fail, otherwise the new app will have to hide it
    }


    //--------------

    /*
    let data = { version: ver }

    App.addListener('appStateChange', async (state) => {
      this.print("appStateChange listener ...");

      if (state.isActive) {
        this.print("state is Active");
        ///
      }
      if (!state.isActive && data.version !== "") {
        this.print("state is NOT Active");
        // Do the switch when user leave app
        SplashScreen.show()
        try {
          let data = { id: ver }
          await CapacitorUpdater.set(data)
        } catch (err) {
          this.print(err)
          SplashScreen.hide() // in case the set fail, otherwise the new app will have to hide it
        }
      }
    });
    */

  }

}



