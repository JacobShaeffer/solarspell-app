import { Component, OnInit, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { Folder } from '../models/folder';
import { FolderData } from '../models/folder-data';
import { ActivatedRoute } from '@angular/router';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { BreadcrumbService } from '../services/breadcrumb.service';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css']
})
export class FolderViewComponent implements OnInit {

  public parentFolder: Folder;
  public contentList: Array<Content> = [];
  public folderList: Array<Folder> = [];
  public logo: string;
  public activeFolderId: number;
  public  math = Math;
  
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public topElement: ElementRef
  ) { }

  ngOnInit() {
    var data = this.route.snapshot.data;
    this.folderList = data.folderData.folders;
    this.parentFolder = data.folderData.parentFolder;
    this.logo = data.folderData.logo;

    this.route.data.subscribe(() => this.getFolderContent());
  }

getFolderContent() {
    this.activeFolderId = parseInt(this.route.snapshot.params['folder_id']);

    var data = this.route.snapshot.data;
    this.contentList = data.folderData.content;
    this.folderList = data.folderData.folders;

    this.breadcrumbService.updateBreadcrumb(this.route.snapshot.data.fullPath);
    let breadcrumb_fullPath = this.breadcrumbService.breadcrumbArray.map((item) => item.name).join('/');
    this.dataService.logAnalytics({activity_type: 'access_folder', title: breadcrumb_fullPath});
  }
}
