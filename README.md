# SunriseSunset

[Català](#català)
[English](#english)

## English
Application to show the sunrise/sunset time at a specific location, using Ionic an electron. You can generate an application for desktop, Android, iOS or the browser.

Includes:

* Geolocation to set the initial position.
* GoogleMaps to choose a different site.
* A calendar to choose a date.
* Translation into different languages.
* Personalized icons and fonts.

Step-by-step implementation is explained (in catalan, automatic translation available) in posts from the blog [https://anomenaidesa.blogspot.com.es](https://anomenaidesa.blogspot.com.es/search/label/Sunrise)

### Install
1. Install NVM (*Node Version Manager*) from [https://github.com/creationix/nvm](https://github.com/creationix/nvm)
2. Install [Node](https://nodejs.org)
```
nvm install latest
```
3. Install [Ionic](https://ionicframework.com/)
```
npm install -g cordova ionic
```
4. Clone this repository
```
git clone https://github.com/jrierab/SunriseSunset.git
```
5. Install dependencies
```
cd SunriseSunset
npm install
```
6. Generate your own *config_keys.json* to allow geolocation on desktop
```
cp config_keys_template.json config_keys.json
```
then edit it to fill with your Google API key for [Geolocation](https://developers.google.com/maps/documentation/geolocation/get-api-key) and [Maps](https://developers.google.com/maps/documentation/javascript/get-api-key).

### Build
1. Test on browser
```
ionic serve -c -s
```
2. Build for android
```
ionic cordova build android
```
3. Test electron desktop application
```
ionic serve --no-open
electron .
```
4. Build linux desktop application with electron
```
npm run dist
```

### Credits
* This application is developed using the [Ionic framework](https://ionicframework.com/framework) which is licensed by [MIT license](https://github.com/ionic-team/ionic/blob/master/LICENSE)
* Desktop application generated by [electron](https://electronjs.org/) which is licensed by [MIT license](https://github.com/electron/electron/blob/master/LICENSE)
* Sunrise/Sunset times provided by [Sunset and sunrise times API](https://sunrise-sunset.org/api) from [Sunset and sunrise times](https://sunrise-sunset.org)
* Location Select Page with Google Maps and Ionic from [Josh Morony's blog](https://www.joshmorony.com/location-select-page-with-google-maps-and-ionic/)
* Ionic calendar developed by [Hsuan Lee (ion2-calendar)](https://github.com/HsuanXyz/ion2-calendar)
* Sunset/Sunrise icons made by [Smashicons](https://www.flaticon.com/authors/smashicons) from [Flaticon](https://www.flaticon.com/) is licensed by [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/)
* Poppins font made by [Indian Type Foundry](https://github.com/itfoundry/poppins) from [Google Fonts](https://fonts.google.com/specimen/Poppins?selection.family=Poppins) is licensed by [Open Font License](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL_web)

## Català
Aplicació per mostrar l'hora de sortida/posta de sol en un lloc determinat, usant Ionic i electron. Pot generar una aplicació d'escriptori, Android, iOS o pel navegador.

Inclou:

* Geolocalització per fixar la posició inicial.
* GoogleMaps per escollir un lloc diferent.
* Un calendari per escollir una data.
* Traducció a diferents idiomes.
* Icones i tipus de lletra personalitzats.

Implementació pas a pas explicada en els articles del bloc [https://anomenaidesa.blogspot.com.es](https://anomenaidesa.blogspot.com.es/search/label/Sunrise)

[Instal·lació](#install)
[Execució](#build)
[Crèdits](#credits)

