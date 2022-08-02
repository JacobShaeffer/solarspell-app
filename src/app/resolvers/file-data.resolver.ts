import { Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { FolderData } from "../models/folder-data";

@Injectable({
    providedIn: 'root',
})
export class FileDataResolver implements Resolve<any> {

    constructor(private dataService: DataService) {}
    
    resolve(route: ActivatedRouteSnapshot): Observable<FolderData> {
        return this.dataService.getFileData(route.paramMap.get('content_id'));
    }
}