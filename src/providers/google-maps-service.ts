import { Injectable } from '@angular/core';
import { Connectivity } from './connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';

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

  constructor(public connectivityService: Connectivity, public geolocation: Geolocation) 
  {
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

        if(this.connectivityService.isOnline()){

          window['mapInit'] = () => {

            this.initMap().then(() => {
              resolve(true);
            });

            this.enableMap();
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if(this.apiKey){
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit&libraries=places';       
          }

          document.body.appendChild(script);  
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