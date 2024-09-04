import { Component } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../package.json';
import { CapacitorUpdater } from '@capgo/capacitor-updater';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  public version: string = packageJson.version;
  constructor(private router: Router) { 
    CapacitorUpdater.notifyAppReady(); // проверяем что текущая версия работает и не надо откатываться
    localStorage.setItem('autoUpdate', "false"); // автоапдейт по умолчанию не работает
    CapacitorUpdater.setUpdateUrl({ url: "" });
    CapacitorUpdater.setStatsUrl({ url: localStorage.getItem('serverUrl') + '/api/statistics' }); //сразу шлем статистику, но только если уже есть запомненная урл сервера
  }

  goHome() {
    this.router.navigate(["/"]); // переход на корень приложения
  }
}
