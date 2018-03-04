import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import * as moment from 'moment';
import { LocationSelect } from '../location-select/location-select';

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

  isLoading : boolean = true;

  date : Date = new Date();
  dateMsg: string = "Avui";
  posMsg : string;
  posError : boolean = false;

  constructor(  public http: HttpClient,
                private geolocation: Geolocation,
                public modalCtrl: ModalController
              )
  {
    moment.locale('ca-ES');
  }

  ionViewDidLoad() {
    let options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    };

    this.geolocation.getCurrentPosition(options).then((answer) => {
      //console.log(answer);
      this.lat = answer.coords.latitude;
      this.lon = answer.coords.longitude;
      this.posMsg = "Posició actual";
      this.posError = false;
      this.isLoading = false;
      this.getSunriseSunsetFromApi();

    }).catch((error) => {
      this.posMsg = "Per defecte";
      this.posError = true;
      this.isLoading = false;
      this.getSunriseSunsetFromApi();
      console.log('Error getting location', error);
    });
  }

  selectDate() {
    const options: CalendarModalOptions = {
      title: 'Escull la data',
      canBackwardsSelected: true,
      closeLabel: "Cancel·lar",
      doneLabel: "Fet",
      weekdays: moment.weekdaysShort(),
      weekStart: 1,
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date) {
        console.log(date);
        this.date = date.dateObj;
        this.dateMsg = this.date.toLocaleDateString("ca-ES");
        this.getSunriseSunsetFromApi();
      }
    });
  }

  getSunriseSunsetFromApi() {
    let data = {  lat: this.lat.toString(), 
                  lng: this.lon.toString(),
                  formatted: "0",
                  date: this.date.toISOString().slice(0,10)
                };

    console.log("Calling API with date= "+data.date);

    const params = new HttpParams({fromObject: data});
    const headers = new HttpHeaders().set("Accept", "application/json");
    let options = {headers: headers, params: params, withCredentials: false};

    this.http.get(this.API, options).subscribe(answer => {
      //console.log(answer);

      if (answer['status']=="OK") {
        let date_options = {hour: "2-digit", minute: "2-digit"};

        this.sunrise = new Date(answer['results'].sunrise)
                                .toLocaleTimeString("ca-ES", date_options);
        this.sunset = new Date(answer['results'].sunset)
                                .toLocaleTimeString("ca-ES", date_options);
      }
    },
    err => console.log(err)
    );    
  }

  launchLocationPage() {
		let modal = this.modalCtrl.create(LocationSelect, {lat: this.lat, lon: this.lon});
	
		modal.onDidDismiss((location) => {
      if(location) {
        console.log("Nou lloc: ", location);
        
        this.lat = location.lat;
        this.lon = location.lng;
        this.posMsg = location.name;
        this.posError = false;
        this.getSunriseSunsetFromApi();
      }
		});

		modal.present();	
	}

}
