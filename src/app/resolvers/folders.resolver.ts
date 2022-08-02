import { Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { ReplaySubject } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
export class FoldersResolver implements Resolve<any> {

    private cache = new ReplaySubject<any>(1);
    private cached = false;

    constructor(private dataService: DataService)  {}

    resolve(): Observable<any> {
        return this.dataService.getFolders();
    }
}