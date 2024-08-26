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
  }

  goHome() {
    this.router.navigate(["/"]); // переход на корень приложения
  }
}
