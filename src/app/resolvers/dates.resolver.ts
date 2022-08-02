import { Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { ReplaySubject } from "rxjs";
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })
export class DatesResolver implements Resolve<any> {

    private cache = new ReplaySubject<any>(1);
    private cached = false;

    constructor(private dataService: DataService)  {}

    resolve(): Observable<any> {
        if(!this.cached) {
            this.cached = true;
            this.dataService.getDates().subscribe(res => {
                this.cached = true;
                this.cache.next(res);
            });
        }

        return this.cache.pipe(first());
    }
}