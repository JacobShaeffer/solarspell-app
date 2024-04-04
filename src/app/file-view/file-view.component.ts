import { Component, OnInit } from "@angular/core";
import { Folder } from "../models/folder";
import { Content } from "../models/content";
import { DataService } from "../services/data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BreadcrumbService } from "../services/breadcrumb.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { environment } from "../../environments/environment";
import { UrlService } from "../services/url.service";

@Component({
  selector: "app-file-view",
  templateUrl: "./file-view.component.html",
  styleUrls: ["./file-view.component.css"],
})
  
export class FileViewComponent implements OnInit {

  public parentFolder: Folder;
  public content: Content;
  public metadataList: [];
  public fileURL: SafeResourceUrl;
  public resourceType: string;
  public pdfUrl: SafeResourceUrl;
  fileExtensions = {
    "video": ["mp4", "mov", "wmv", "avi", "mpg", "mpeg", "3gp", "3g2", "flv", "f4v", "webm"],
    "audio": ["mp3", "wav", "ogg", "aac", "flac", "wma", "m4a"]
  }
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private urlService: UrlService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.content = data.fileData.content;
      this.metadataList = data.fileData.metadata;
      this.parentFolder = data.fileData.parentFolder;
      this.breadcrumbService.updateBreadcrumb(this.route.snapshot.data.fullPath);
      this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.contentUrl.concat(this.content.file_name)
      );
    
      this.logAnalytics('access_content');
    });

    window.scroll(0, 0);

    if (this.fileExtensions["video"].some(ext => this.content.file_name.includes(ext))) {
      this.resourceType = "video";
    } else if (this.fileExtensions["audio"].some(ext => this.content.file_name.includes(ext))) {
      this.resourceType = "audio";
    } else {
      this.resourceType = "pdf_or_undefined";
    }
  }

  searchKeyword(name) {
    if (name.trim() != "") {
      this.router.navigate(["/search-list/keyword", name.toLowerCase()]);
    }
  }

  //Called when download button is clicked
  logAnalytics(type: string) {
    var analytics = {
      title: this.content.title,
      language: '',
      content_type: '',
      subject: '',
      parent_folder: this.parentFolder,
      activity_type: type,
      referrer: 'other'
    }

    //Check if the previous url was stored, if so, check store the section of the website
    if(this.urlService.getPreviousUrl()) {
      var slicedUrl = this.urlService.getPreviousUrl().slice(0, 9);

      switch(slicedUrl) {
        case '/content/':
          analytics.referrer = 'folder';
          break;
        case '/search-l':
          analytics.referrer = 'search';
          break;
        default:
          analytics.referrer = 'other';
          break;
      }
    }
    else {
      analytics.referrer = 'new tab/reload';
    }

    //Loop through metadata and set corresponding variables
    this.metadataList.forEach(element => {
      switch(element['name']) {
        case 'Language':
          analytics.language = element['value'];
          break;

        case 'Subject':
          analytics.subject = element['value'];
          break;

        case 'Resource Type':
          analytics.content_type = element['value'];
          break;
      }
    });

    //Log analytics with gathered metadata
    console.log("Logging analytics: ", analytics);
    this.dataService.logAnalytics(analytics);
  }
}
