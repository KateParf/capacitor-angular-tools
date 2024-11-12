import { HttpClient } from '@angular/common/http'
import { Component, Inject, ElementRef, Renderer2, NgZone, OnInit, OnDestroy } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { BackgroundFetch } from '@transistorsoft/capacitor-background-fetch';

@Component({
  selector: 'app-backgroundtask',
  templateUrl: './backgroundtask.component.html',
})


export class BackgroundTaskComponent implements OnInit, OnDestroy {

  private appStateChangeListener: Promise<PluginListenerHandle> | undefined;

  constructor(
    @Inject('BASE_URL') public baseUrl: string,
    private http: HttpClient,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dbService: NgxIndexedDBService,
    private readonly ngZone: NgZone) {
  }

  public ngOnInit(): void {
    this.print('[BackgroundFetch] ngOnInit');
    this.addListeners();
  }

  public ngOnDestroy() {
    this.appStateChangeListener?.then(listener => listener.remove());
    App.removeAllListeners();
  }

  ngAfterContentInit() {
    this.print('[BackgroundFetch] ngAfterContentInit');
    this.initBackgroundFetch();
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

  // --- запись в бд
  public async addState(state: string) {
    this.dbService
      .add("bgProcesses", { state: state, time: new Date() })
      .subscribe((key) => {
        console.log('State added. key: ', key);
      });
  }

  // --- получение записей из бд
  public async getStates() {
    let states: dbState[] = [];
    await this.dbService.getAll<dbState>("bgProcesses").forEach(d => { states = states.concat(d); });
    this.print("All states:");
    states.forEach(element => {
      this.print(`State: ${element.state} | Time: ${element.time}`);
    });
  }

  // --- активирование листенеров для активности приложения
  private addListeners(): void {

    App.addListener('appStateChange', (state) => {
      //this.print(`App state changed. Is active: ${state.isActive}.`);
      this.addState(state.isActive ? "active" : "not active");
    });

    App.addListener('pause', () => {
      //this.print(`App state changed. It's pause.`);
      this.addState("pause");
    });

    App.addListener('resume', () => {
      //this.print(`App state changed. It's resume.`);
      this.addState(`resume`);
    });

    App.addListener('backButton', (state) => {
      //this.print(`App state changed. It's ${state.canGoBack ? "can go back" : "not can go back"}.`);
      this.addState(state.canGoBack ? "can go back" : "not can go back");
    });

  }
  public async addBGTask() {
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        return;
      }
    });
  }

  // --- тест плагина capacitor-background-fetch
  async initBackgroundFetch() {
    this.print('[BackgroundFetch] start');
    const status = await BackgroundFetch.configure({
      minimumFetchInterval: 15
    }, async (taskId) => {
      this.print('[BackgroundFetch] EVENT:'+ taskId);
      // Perform your work in an awaited Promise
      this.print('[BackgroundFetch] work start...');
      const result = await this.performYourWorkHere();
      this.print('[BackgroundFetch] work complete:'+ result);
      // [REQUIRED] Signal to the OS that your work is complete.
      BackgroundFetch.finish(taskId);
    }, async (taskId) => {
      // The OS has signalled that your remaining background-time has expired.
      // You must immediately complete your work and signal #finish.
      this.print('[BackgroundFetch] TIMEOUT:'+ taskId);
      // [REQUIRED] Signal to the OS that your work is complete.
      BackgroundFetch.finish(taskId);
    });

    // Checking BackgroundFetch status:
    if (status !== BackgroundFetch.STATUS_AVAILABLE) {
      // Uh-oh:  we have a problem:
      if (status === BackgroundFetch.STATUS_DENIED) {
        this.print('[BackgroundFetch] The user explicitly disabled background behavior for this app or for the whole system.');
        alert('The user explicitly disabled background behavior for this app or for the whole system.');
      } else 
      if (status === BackgroundFetch.STATUS_RESTRICTED) {
        this.print('[BackgroundFetch] Background updates are unavailable and the user cannot enable them again.');
        alert('Background updates are unavailable and the user cannot enable them again.')
      }
    }
  }

  async performYourWorkHere() {
    return new Promise((resolve, reject) => {
      this.print('[BackgroundFetch] !!! TASK START...');
      setTimeout(() => {
        resolve(true);
      }, 5000);
      this.print('[BackgroundFetch] !!! TASK FINISH.');
    });
  }

}

interface dbState {
  state: string,
  time: Date
}