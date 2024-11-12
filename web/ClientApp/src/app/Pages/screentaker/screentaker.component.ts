import { Component, ViewChild } from '@angular/core';
import { NgxCaptureService } from "ngx-capture";
import { tap } from 'rxjs';
import * as comparePNG from "src/app/Pages/screentaker/comparePNG";

@Component({
  selector: 'app-screentaker',
  templateUrl: './screentaker.component.html'
})

export class screentakerComponent {

  constructor(private captureService: NgxCaptureService) { }

  diff: any
  @ViewChild('screen', { static: true }) screen: any;

  takeScreen() {
    this.captureService
      .getImage(document.body, true)
      .pipe(
        tap(async (img) => {
          console.log("Screen taken!");
          //this.captureService.downloadImage(img);
          this.diff = comparePNG.doCompare(img);
        })
      )
      .subscribe();
  }

}
