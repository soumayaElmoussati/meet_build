import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getAllCountries(): any {
    return this.http.get(this.apiUrl + 'countries');
  }
  getAllCities(): any {
    return this.http.get(this.apiUrl + 'cities');
  }

}
