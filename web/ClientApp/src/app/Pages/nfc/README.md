## Функция чтения NFC-меток

Используется платный плагин Capacitor для чтения и записи NFC-меток от Capawesome - https://capawesome.io/plugins/nfc/ 

Функция реализована на отдельной странице. 
* Проверяется поддержка телефоном НФЦ, при открытии страницы, и выводится информация на странице.
* Вызов функции read() осуществляется нажатием на кнопку “read NFC”. Функция read использует метод Nfc.addListener() для прослушивания события nfcTagScanned, в котором происходит остановка текущего сеанса сканирования (await Nfc.stopScanSession()) и получение информации из метки - resolve(event.nfcTag). 

После успешного чтения NFC-метки сохраняется информация о прочитанной метке. 

В конце функция вызывает метод Nfc.startScanSession() для начала нового сеанса сканирования. 

На экран выводится информация о метке:
* Tag Identifier
* Tag Type
* Technologies
* Size
* Application Data
* Barcode
* Message

