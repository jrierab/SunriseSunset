import { Injectable } from '@angular/core';
import { Connectivity } from './connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';

import { LangService } from '../providers/lang-service';

@Injectable()
export class GoogleMapsService {
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string; //  = "YOUR_API_KEY";
	lat: number = null;
	lon: number = null;

  googleMapScriptElement : any;

  constructor(  public connectivityService: Connectivity, 
                public geolocation: Geolocation,
                public langService : LangService,  
              ) 
  {
    this.langService.onLang.subscribe(lang=> {
      if(this.googleMapScriptElement) {
        console.log("[GoogleMapsService] Current lang: "+lang);

        this.updateScriptSrc();
      }
    });
  }

  init(mapElement: any, pleaseConnect: any, lat: number, lon: number): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    this.lat = lat;
    this.lon = lon;

    return this.loadGoogleMaps();
  }

  loadGoogleMaps(): Promise<any> {
    return new Promise((resolve) => {

      if(typeof google == "undefined" || typeof google.maps == "undefined") {

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if(this.connectivityService.isOnline()) {

          window['mapInit'] = () => {

            this.initMap().then(() => {
              resolve(true);
            });

            this.enableMap();
          }

          this.updateScriptSrc();
        } 
      } else {

        if(this.connectivityService.isOnline()){
          this.initMap();
          this.enableMap();
        } else {
          this.disableMap();
        }

		    resolve(true);
      }

      this.addConnectivityListeners();
    });
  }

  updateScriptSrc() {
    let lang = this.langService.getCurrentLang();

    console.log("[GoogleMapsService].updateScriptSrc with lang: "+lang);
    
    if(this.googleMapScriptElement) {
      let head = document.getElementsByTagName('head')[0];
      let scripts = Array.prototype.slice.call(head.getElementsByTagName('script'));
      let styles = Array.prototype.slice.call(head.getElementsByTagName('style'));

      scripts.forEach(s=> {
        if(s.src.indexOf("://maps.google") != -1) head.removeChild(s);
        else if(!s.src || s.src.indexOf("cordova.js") != -1 || s.src.indexOf("ion-dev.js") != -1) {}
        else console.log("Skip removing <script src='"+s.src+"'");
      });
      styles.forEach(s=> {
        if(s.textContent.indexOf(".gm-style") != -1) head.removeChild(s);
        else console.log("Skip removing <style>", s);
      });
      document.body.removeChild(this.googleMapScriptElement);
    }

    let script = document.createElement("script");
    script.id = "googleMaps";

    if(this.apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places&language='+lang;
    } else {
      script.src = 'http://maps.google.com/maps/api/js?callback=mapInit&libraries=places&language='+lang;       
    }    

    this.googleMapScriptElement = document.body.appendChild(script);
  }

  initMap(): Promise<any> {
    this.mapInitialised = true;

    return new Promise((resolve) => {
      if(this.lat && this.lon) {
        this.initMapPos(this.lat, this.lon);
        resolve(true);

      } else {
        this.geolocation.getCurrentPosition().then((position) => {
          this.initMapPos(position.coords.latitude, position.coords.longitude);
          resolve(true);

        }).catch((error) => {
          console.log('Error getting location'+JSON.stringify(error));
          return Promise.reject("Unable to get location");
        });
      }
    });
  }

  initMapPos(lat: number, lon: number) {
    let latLng = new google.maps.LatLng(lat, lon);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement, mapOptions);
  }

  disableMap(): void {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
    }
  }

  enableMap(): void {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
    }
  }

  addConnectivityListeners(): void {
    this.connectivityService.watchOnline().subscribe(() => {

      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        } else {
          if(!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }
      }, 2000);

    });

    this.connectivityService.watchOffline().subscribe(() => {
      this.disableMap();
    });
  }
}