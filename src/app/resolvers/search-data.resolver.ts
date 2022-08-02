import { Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { ActivatedRouteSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class SearchDataResolver implements Resolve<any> {

  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.dataService.singleSearch(route.paramMap.get('search_string'))
  }
}