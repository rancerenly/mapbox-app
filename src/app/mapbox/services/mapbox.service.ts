import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FeatureCollection} from "../models/map";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  constructor(private http: HttpClient) { }

  public getData(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(environment["baseUrl"]);
  }

}
