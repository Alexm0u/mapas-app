import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Feature, PlacesResponse } from '../interfaces/places';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(private http: HttpClient) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.userLocation = [coords.longitude, coords.latitude];
        resolve(this.userLocation);
      },
      (err) => {
        alert('No se pudo obtener la geolocalización')
        reject();
      });
    });
  }

  getPlacesByQuery(query: string ='') {

    this.isLoadingPlaces = true;
    this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=-0.3289427168157033%2C39.48322536517395&language=es&access_token=pk.eyJ1IjoicmFxdWVsMjI5MiIsImEiOiJjbG10ODFteWYwMzA0MndxcGpsNW9rd21vIn0.t1wyjbjuYEA-ZHWZs44PIg`)
    .subscribe(resp => {
      console.log(resp.features)

      this.isLoadingPlaces = false;
      this.places = resp.features;
    });
  }
}
