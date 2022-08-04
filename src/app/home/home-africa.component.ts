import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Folder } from '../models/folder';
import { ActivatedRoute } from '@angular/router';

var math = Math;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  
})
export class HomeComponent implements OnInit {
  public folders: Array<Folder> = [];
  public modules: Array<Folder> = [];
  public ltp: Folder;
 

//this variable holds Math
public  math = Math;

  constructor(private dataService: DataService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let all_folders = this.route.snapshot.data.folders;
    this.modules = this.route.snapshot.data.modules;
    this.ltp = all_folders.find( ({ folder_name }) => folder_name === 'Learning Through Play' );
    this.folders = all_folders.filter(item => item.folder_name !== 'Learning Through Play');
  }

  //Called when a link to a module is clicked
  logModuleAnalytics(name) {
    this.dataService.logAnalytics({ title: name, activity_type: 'open_module' });
  }

}

