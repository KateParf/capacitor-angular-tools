import { HttpClient } from '@angular/common/http'
import { Component, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import versionJson from '../../../../package.json';
import { BundleInfo, CapacitorUpdater, UpdateAvailableEvent, UpdateUrl } from '@capgo/capacitor-updater';
import { App } from '@capacitor/app';
import { OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { Dialog } from '@capacitor/dialog'

@Component({
  selector: 'app-autoupdate',
  templateUrl: './autoupdate.component.html',
})


export class AutoUpdateComponent {
  constructor(
    @Inject('BASE_URL') public baseUrl: string,
    private http: HttpClient,
    private modalService: BsModalService,
    private renderer: Renderer2,
    private elementRef: ElementRef) {
  }

  // --- вывод лога
  status: string = "";
  private print(msg: any) {
    console.log(msg);
    const newDiv: HTMLElement = this.renderer.createElement('div');
    newDiv.setAttribute('class', 'log card');
    newDiv.innerText = msg;
    this.renderer.appendChild(this.elementRef.nativeElement, newDiv);
    //this.status += "\n\n------\n\n" + msg;
  }

  // --- хранение и запоминание ссылки на сервер где обновления лежат
  urlForm = new FormGroup({
    "URL": new FormControl("",
      [Validators.required,
      Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
      ]),
    "autoUpdate": new FormControl(false, [])
  });

  public storedUrl: string | null = localStorage.getItem('serverUrl');

  // обработчик кнопки сохранения введенного УРЛ сервера в стораж
  onStoreURL() {
    this.storedUrl = this.urlForm.value.URL?.toString() == null ? '' : this.urlForm.value.URL?.toString();
    localStorage.setItem('serverUrl', this.storedUrl);
    CapacitorUpdater.setStatsUrl({ url: this.storedUrl + '/api/statistics' }); // как только получаем урл сервера, начинаем слать статистику
    this.print("storing URL : " + this.storedUrl + " | " + localStorage.getItem('serverUrl'));
  }

  // --- автообновление
  // проверка обновляем вручную или автоматически
  autoUpdate: boolean = localStorage.getItem('autoUpdate') == 'true';
  public async setAuto() {
    this.autoUpdate = !this.autoUpdate;
    localStorage.setItem('autoUpdate', this.autoUpdate.toString()); //??
    if (this.autoUpdate) {
      this.callAutoUpdate();

      CapacitorUpdater.addListener('updateAvailable', async (res) => {
        this.loadData = res.bundle;
        /*
        const { value } = await Dialog.confirm({
          title: 'Update Available',
          message: `Version ${res.bundle.version} is available. Would you like to update now?`,
        })
    
        if (value)
          CapacitorUpdater.set(res.bundle)
        */
        this.onAutoUpdateAvailable();
      });
      
      CapacitorUpdater.setStatsUrl({ url: this.storedUrl + '/api/statistics' });
      const url = this.storedUrl + '/api/autoupdate';
      CapacitorUpdater.setUpdateUrl({ url: url });
    }
    else {
      CapacitorUpdater.setUpdateUrl({ url: "" });
    }
  }
  // --- вывод модального окна про доступность нового обновления
  bsModalRef?: BsModalRef;
  @ViewChild('tplauto') tplauto?: TemplateRef<any>;
  onAutoUpdateAvailable() {
    this.print("onAutoUpdateAvailable");

    this.bsModalRef = this.modalService.show(this.tplauto ? this.tplauto : "");
    this.bsModalRef.onHidden?.subscribe(() => {
      console.log("modal closed");
    });
  }

  public async callAutoUpdate() {
    var postData: PostData = {
      platform: "android",
      device_id: "UUID_of_device_unique_by_install",
      app_id: "APPID_FROM_CAPACITOR_CONFIG",
      custom_id: "your_custom_id_set_on_runtime",
      plugin_version: "PLUGIN_VERSION",
      version_build: "VERSION_NUMBER_FROM_NATIVE_CODE",
      version_code: "VERSION_CODE_FROM_NATIVE_CODE",
      version_name: "LAST_DOWNLOADER_VERSION",
      version_os: "VERSION_OF_SYSYEM_OS",
      is_emulator: false,
      is_prod: false,
    }

    const url = this.storedUrl + '/api/autoupdate';

    this.print("Request to url: " + url);
    this.http.post<UpdateData>(url, postData).subscribe(result => {
      // писать отладку что запрос отправлен на урл такой-то
      if (result) {
        this.print("Autoupdate result: " + result.url + " | " + result.version);
      } else {
        this.print("error request");
      }
    }, error => console.error(error));
  }

  // --- ручное обновление
  currentVersion: string = ''; // тек вер клиента
  accessibleVersions: string[] = []; // все версии на сервере 
  updateFlag: boolean = false; // флаг нужно ли показывать кнопки со скачиванием версий
  bundles: BundleInfo[] = [];
  loadData: BundleInfo | undefined;

  // получение текущей версии клиента из package.json
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

    const url = this.storedUrl + '/api/updateslist';
    this.print("Request to url: " + url);

    this.http.get<string[]>(url).subscribe(result => {
      this.accessibleVersions = result;
      // писать отладку что запрос отправлен на урл такой-то
      this.print("Last ver on server: " + this.accessibleVersions[this.accessibleVersions.length - 1]);

      // можно рисовать кнопки скачивания версий с сервера
      this.updateFlag = true;
    }, error => console.error(error));

  }

  // --- вывод модального окна загрузить обновление сейчас или при след заходе
  @ViewChild('tpl') tpl?: TemplateRef<any>;
  onApdateAvailable() {
    this.print("onApdateAvailable");
    this.bsModalRef = this.modalService.show(this.tpl ? this.tpl : "");
    this.bsModalRef.onHidden?.subscribe(() => {
      console.log("modal closed");
    });
  }

  // обновить прям щас
  async nowUpdate() {
    this.bsModalRef?.hide();
    this.print("start update app ...");
    ///SplashScreen.show();
    try {
      this.print(this.loadData);
      let dataUpd = { id: ((this.loadData == undefined) ? "" : this.loadData.id) }
      await CapacitorUpdater.set(dataUpd);
      this.print("[v] update ok");
      await CapacitorUpdater.reload();

    } catch (err) {
      this.print("!!! update error:");
      this.print(err);
      ///SplashScreen.hide(); // in case the set fail, otherwise the new app will have to hide it
    }
  }

  // обновить потом
  async laterUpdate() {
    this.bsModalRef?.hide();
    this.print("update app later");
    try {
      this.print(this.loadData);
      let dataUpd = { id: ((this.loadData == undefined) ? "" : this.loadData.id) }
      await CapacitorUpdater.next(dataUpd);
      this.print("[v] update ok");
      await CapacitorUpdater.reload();

    } catch (err) {
      this.print("!!! update error:");
      this.print(err);
      ///SplashScreen.hide(); // in case the set fail, otherwise the new app will have to hide it
    }
  }

  // обработчик кнопки - version xxx
  async update(ver: string) {
    this.print("update to ver: " + ver);
    const distFile = `/client-updates/${ver}/com.smsit.capacitordemo_${ver}.zip`;
    console.log('download', this.storedUrl + distFile);
    //------
    // Do the download during user active app time to prevent failed download
    this.print("downloading ...");
    this.loadData = await CapacitorUpdater.download({
      version: ver,
      url: this.storedUrl + distFile,
    });
    this.print("[v] download finished.");
    this.print(this.loadData.version + " | id = " + this.loadData.id + " | status = " + this.loadData.status);
    //!! confirm dialog - update now or later
    this.onApdateAvailable();
  }

  // --- статистика
  sendStats() {
    const url = this.storedUrl + '/api/statistics';

    var postData: AppInfosStats = {
      "action": "set",
      "app_id": "**.***.**",
      "device_id": "*******", 
      "platform": "android",
      "custom_id": "user_1",
      "version_name": "113.0.3", 
      "version_build": "113.0.3",
      "version_code": "120",
      "version_os": "16",
      "plugin_version": "4.0.0",
      "is_emulator": false,
      "is_prod": false,
    }
    this.print("Request to url: " + url);
    this.http.post<string>(url, postData).subscribe(res => {
      // писать отладку что запрос отправлен на урл такой-то
      if (res == 'ok') {
        this.print("Stats send!");
      } else {
        this.print("error request");
      }
    }, error => console.error(error));
  }
}

interface UpdateData {
  version: string;
  url: string;
}

interface PostData {
  platform: string,
  device_id: string,
  app_id: string,
  custom_id: string,
  plugin_version: string,
  version_build: string,
  version_code: string,
  version_name: string,
  version_os: string,
  is_emulator: boolean,
  is_prod: boolean,
}

interface AppInfosStats {
  action: string,
  app_id: string,
  device_id: string,
  platform: string,
  custom_id: string,
  version_name: string,
  version_build: string,
  version_code: string,
  version_os: string,
  plugin_version: string,
  is_emulator: boolean,
  is_prod: boolean,
}