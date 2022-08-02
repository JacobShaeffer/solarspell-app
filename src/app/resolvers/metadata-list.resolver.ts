import { Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { ReplaySubject } from "rxjs";
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })
export class MetadataListResolver implements Resolve<any> {

    constructor(private dataService: DataService)  {}

    resolve(): Observable<any> {
        return this.dataService.getMetadataList();
    }
}