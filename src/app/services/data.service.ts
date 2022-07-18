import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FolderData } from '../models/folder-data';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SearchData } from '../models/search-data';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
   }

  getFolders(): Observable<any> {
     return this.http.get(this.apiUrl.concat('folder_get_all.php',""));
   }

  getModules(): Observable<any> {
    return this.http.get(this.apiUrl.concat('module_get_all.php',""));
  }

  getFolderTree(): Observable<any> {
    return this.http.get(this.apiUrl.concat('folder_get_tree.php',""));
  }

  getFolderData(parentId): Observable<any> {
    let params = new HttpParams();
    params = params.append('folder_id', parentId);
    return this.http.get(this.apiUrl.concat('folder_get_children.php'), {params});
  }

  getFileData(contentId): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', contentId);
    return this.http.get(this.apiUrl.concat('content_get_by_id.php'), {params});
  }

  getMetadataList(): Observable<any> {
    return this.http.get(this.apiUrl.concat('metadata_list_by_type.php'));
  }

  singleSearch(searchString): Observable<any> {
    let params = new HttpParams();
    params = params.append('search_string',searchString);
    return this.http.get(this.apiUrl.concat('content_fts.php'), {params});
  }

  advancedSearch(searchData: SearchData): Observable<any> {
    return this.http.post(this.apiUrl.concat('content_advanced_search.php'),searchData);
  }

  keywordSearch(keyword: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('keyword_name',keyword);
    return this.http.get(this.apiUrl.concat('content_keyword_search.php'),{params});
  }

  getFullPath(id, isFolder) {
    let params = new HttpParams();
    params = params.append('id', id);
    params = params.append('isFolder', isFolder ? '1' : '0');
    return this.http.get(this.apiUrl.concat('get_full_path.php'), {params});
  }

  /*
  Logs analytics in usage table
  Takes parameter 'params'
  'params' should be an object with format: { title: '<identifier>', activity_type: '<activity_type>' }
  Other elements, like language, content_type, subject, and parent_folder can be included
  if they are supported by log_analytics.php
  */
  logAnalytics(params) {
    this.http.get(
      this.apiUrl.concat('log_analytics.php',""),
      { params: params }
    ).subscribe();
  }

  getDates() {
    return this.http.get(this.apiUrl.concat('content_get_dates.php'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class FolderDataResolver implements Resolve<FolderData> {
  constructor(private dataService: DataService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<FolderData> {
    return this.dataService.getFolderData(route.paramMap.get('folder_id'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class FileDataResolver implements Resolve<any> {
  constructor(private dataService: DataService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<FolderData> {
    return this.dataService
    .getFileData(route.paramMap.get('content_id'));
  }
}


@Injectable({
  providedIn: 'root',
})
export class SearchDataResolver implements Resolve<any> {
  constructor(private dataService: DataService) {}
  resolve(route: ActivatedRouteSnapshot): any {
    return this.dataService.singleSearch(route.paramMap.get('search_string'))

  }
}

@Injectable({
  providedIn: 'root',
})
export class SearchKeywordResolver implements Resolve<any> {
  constructor(private dataService: DataService)  {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.dataService.keywordSearch(route.paramMap.get('search_string'))
  }
}