import { Component } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import {
  CheckBiometryResult,
  AndroidBiometryStrength,
  BiometryError,
  BiometryErrorType,
  BiometryType,
} from './definitions'

let appListener: PluginListenerHandle;

@Component({
  selector: 'app-biometricauth',
  templateUrl: './biometricauth.component.html'
})



export class BiometricAuthComponent {
  public status: string = "";
  public authFlag: boolean = false;
  
  updateBiometryInfo(info: CheckBiometryResult): void {
    console.log("Status: ", info);
    if (info.isAvailable) {
      // Biometry is available, info.biometryType will tell you the primary type.
      this.status = "Biometry is available";
      this.authFlag = true;
    } else {
      // Biometry is not available, info.reason and info.code will tell you why.\
      this.status = "Biometry is not available";
      this.authFlag = false;
    }
  }
  
  async StartListen(): Promise<void> {
    this.updateBiometryInfo(await BiometricAuth.checkBiometry())
  
    try {
      appListener = await BiometricAuth.addResumeListener(this.updateBiometryInfo)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }
  
  async StopListen(): Promise<void> {
    await appListener?.remove()
  }

  public async checkBiometry() {
    this.status = "... checking BIO avail ...";

    // stub for web
    //await BiometricAuth.setBiometryType(BiometryType.faceAuthentication);
    //await BiometricAuth.setDeviceIsSecure(true);
    //await BiometricAuth.setBiometryIsEnrolled(true);

    this.StartListen();
  }
 
  public async authenticate(): Promise<void> {
    try {
      await BiometricAuth.authenticate({
        reason: 'Please authenticate',
        cancelTitle: 'Cancel',
        allowDeviceCredential: false,
        iosFallbackTitle: 'Use passcode',
        androidTitle: 'Biometric login',
        androidSubtitle: 'Log in using biometric authentication',
        androidConfirmationRequired: false,
        androidBiometryStrength: AndroidBiometryStrength.weak,
      })
      .then(() => {
        this.status = "AUTH ok !";
      })
      .catch((reason) => {
        this.status = "AUTH catch: " + reason;
      })
    } catch (error) {
      // error is always an instance of BiometryError.
      if (error instanceof BiometryError) {
        if (error.code !== BiometryErrorType.userCancel) {
          this.status = "ERROR auth: " + error.message + " | " + error;
        } else {
          this.status = "ERROR user cancel: " + error.message + " | " + error;
        }
      }
    }
  }

  public async doBioAuth() {
    this.status = "... run BIO auth ...";

    // stub for web
    // await BiometricAuth.setBiometryType(BiometryType.faceAuthentication);
    //await BiometricAuth.setDeviceIsSecure(true);
    //await BiometricAuth.setBiometryIsEnrolled(true);
    
    this.authenticate();
  }


}
