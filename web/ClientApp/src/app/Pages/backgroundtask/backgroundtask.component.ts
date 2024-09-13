import { HttpClient } from '@angular/common/http'
import { Component, Inject, ElementRef, Renderer2 } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-backgroundtask',
  templateUrl: './backgroundtask.component.html',
})


export class BackgroundTaskComponent {
  constructor(
    @Inject('BASE_URL') public baseUrl: string,
    private http: HttpClient,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dbService: NgxIndexedDBService) {
      App.addListener('appStateChange', (state) => {
        this.print(`App state changed. Is active: ${state.isActive}`);
        this.addState(state.isActive?"active":"not active");
      });
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
        console.log('Dance added to favs. key: ', key);
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
}

interface dbState {
  state: string,
  time: Date
}