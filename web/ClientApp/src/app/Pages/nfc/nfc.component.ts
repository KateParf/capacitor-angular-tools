import { Component } from '@angular/core';
import { Nfc, NfcUtils, NfcTag, NdefRecord } from '@capawesome-team/capacitor-nfc';

@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.component.html'
})

export class NFCComponent {

  public status = ''; 
  public scannedTag: NfcTag | undefined;
  public scannedTagMessage: NdefRecord[] | undefined;

  createNdefTextRecord = () => {
    const utils = new NfcUtils();
    const { record } = utils.createNdefTextRecord({ text: 'Capacitor NFC Plugin' });
    return record;
  };

  read = async () => {
    this.scannedTag = undefined;
    this.status = "ready to read nfc tag"
    return new Promise((resolve) => {
      Nfc.addListener('nfcTagScanned', async (event) => {
        await Nfc.stopScanSession();
        resolve(event.nfcTag);
        this.status = "complete read nfc tag";
        this.scannedTag = event.nfcTag;
        this.scannedTagMessage = this.scannedTag.message?.records;
      });

      Nfc.startScanSession();
    });
  };

  
}
