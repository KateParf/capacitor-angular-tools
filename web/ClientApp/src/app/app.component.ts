import { Component } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  public version: string = packageJson.version;
  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(["/"]); // переход на корень приложения
  }
}
