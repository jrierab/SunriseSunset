import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  API: string = "https://api.sunrise-sunset.org/json";
  
  // Estany de Sant Maurici
  lat: number = 42.582104;
  lon: number = 1.0008419;

  sunrise : string;
  sunset : string;

  posMsg : string;
  posError : boolean = false;

  constructor(  public navCtrl: NavController,
                public http: HttpClient,
                private geolocation: Geolocation
  )
  {
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((answer) => {
      //console.log(answer);
      this.lat = answer.coords.latitude;
      this.lon = answer.coords.longitude;
      this.posMsg = "Posició actual";
      this.getSunriseSunsetFromApi();

    }).catch((error) => {
       console.log('Error getting location', error);
       this.posMsg = "Per defecte";
       this.posError = true;
       this.getSunriseSunsetFromApi();
     });
     
  }

  getSunriseSunsetFromApi() {
    console.log("Calling API...");

    let data = {  lat: this.lat.toString(), 
                  lng: this.lon.toString(),
                  formatted: "0"
                };

    const params = new HttpParams({fromObject: data});
    const headers = new HttpHeaders().set("Accept", "application/json");
    let options = {headers: headers, params: params, withCredentials: false};

    this.http.get(this.API, options).subscribe(answer => {
      console.log(answer);

      if (answer['status']=="OK") {
        let date_options = {hour: "2-digit", minute: "2-digit"};

        this.sunrise = new Date(answer['results'].sunrise).toLocaleTimeString("ca-ES", date_options);
        this.sunset = new Date(answer['results'].sunset).toLocaleTimeString("ca-ES", date_options);

        console.log(this.sunrise);
        console.log(this.sunset);
      }
    },
    err => console.log(err)
    );    
  }

}
