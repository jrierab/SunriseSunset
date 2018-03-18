import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import * as moment from 'moment';
import { LocationSelect } from '../location-select/location-select';

import {TranslateService} from '@ngx-translate/core';
import { LangService } from '../../providers/lang-service';

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
  dateMsg: string;
  posMsg : string;
  posError : boolean = false;

  lang : string;
  isRealLocation : boolean = false;
  isRealDate : boolean = false;

  constructor(  public http: HttpClient,
                private geolocation: Geolocation,
                public modalCtrl: ModalController,
                public translate: TranslateService,
                public langService : LangService,  
              )
  {
  }

  ionViewDidLoad() {
    console.log("### HomePage");
    let options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    };

    this.geolocation.getCurrentPosition(options).then((answer) => {
      //console.log(answer);
      this.lat = answer.coords.latitude;
      this.lon = answer.coords.longitude;
      this.posMsg = "APP.current-pos";
      this.posError = false;
      this.isLoading = false;
      this.getSunriseSunsetFromApi();

    }).catch((error) => {
      this.posMsg = "APP.default-pos";
      this.posError = true;
      this.isLoading = false;
      this.getSunriseSunsetFromApi();
      console.log('Error getting location', error);
    });

    this.dateMsg = "APP.today";

    this.langService.onLang.subscribe(lang=> {
      this.lang = this.translate.currentLang;
      console.log("[HomePage] Current lang: "+this.lang);
      moment.locale(this.lang);  
    });
  }

  selectDate() {
    const options: CalendarModalOptions = {
      title: this.translate.instant("APP.date-choose"),
      canBackwardsSelected: true,
      closeLabel: this.translate.instant('APP.Cancel'),
      doneLabel: this.translate.instant('APP.Done'),
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
        this.dateMsg = this.date.toLocaleDateString(this.lang);
        this.isRealDate = true;
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
                                .toLocaleTimeString(this.lang, date_options);
        this.sunset = new Date(answer['results'].sunset)
                                .toLocaleTimeString(this.lang, date_options);
      }
    },
    err => console.log(err)
    );    
  }

  launchLocationPage() {
		let modal = this.modalCtrl.create(LocationSelect, {lat: this.lat, lon: this.lon});
	
		modal.onDidDismiss((location) => {
      if(location) {
        console.log("New place: ", location);
        
        this.lat = location.lat;
        this.lon = location.lng;
        this.posMsg = location.name;
        this.isRealLocation = true;
        this.posError = false;
        this.getSunriseSunsetFromApi();
      }
		});

		modal.present();	
	}

  doChangeLang() {
    this.langService.setLanguage(this.lang);
  }
}
