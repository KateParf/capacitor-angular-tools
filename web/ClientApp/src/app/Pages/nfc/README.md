## Функция чтения NFC-меток

Используется платный плагин Capacitor для чтения и записи NFC-меток от Capawesome - https://capawesome.io/plugins/nfc/ 

Для Android добавить в `AndroidManifest.xml` после application tag:
```
<!-- To get access to the NFC hardware. -->
<uses-permission android:name="android.permission.NFC" />
<!-- The minimum SDK version that your application can support. -->
<uses-sdk android:minSdkVersion="10"/>
<!-- (Optional) This will ensure that your app appears in Google Play only for devices with NFC hardware. -->
<uses-feature android:name="android.hardware.nfc" android:required="true" />
```


Для IOS добавить в файл `Info.plist` ключ `NFCReaderUsageDescription`

```
<key>NFCReaderUsageDescription</key>
<string>The app enables the reading and writing of various NFC tags.</string>
```

И включить Near Field Communication Tag Reading возможности в приложении в Xcode.

Функция реализована на отдельной странице. 
* Проверяется поддержка телефоном НФЦ, при открытии страницы, и выводится информация на странице.
* Вызов функции `read()` осуществляется нажатием на кнопку “read NFC”. Функция read использует метод `Nfc.addListener()` для прослушивания события `nfcTagScanned`, в котором происходит остановка текущего сеанса сканирования (`await Nfc.stopScanSession()`) и получение информации из метки - `resolve(event.nfcTag)`. 

После успешного чтения NFC-метки сохраняется информация о прочитанной метке. 

В конце функция вызывает метод `Nfc.startScanSession()` для начала нового сеанса сканирования. 

На экран выводится информация о метке:
* Tag Identifier
* Tag Type
* Technologies
* Size
* Application Data
* Barcode
* Message

