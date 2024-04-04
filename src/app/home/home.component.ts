import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Folder } from '../models/folder';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  
})

export class HomeComponent implements OnInit {
  public folders: Array<Folder> = [];
  public modules: Array<Folder> = []; 

  //Used in home.component.html
  public  math = Math;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.folders = this.route.snapshot.data.folders;
    this.modules = this.route.snapshot.data.modules;
    
    let value = `; ${document.cookie}`;
    let parts = value.split(`; user_id=`);
    let id = parts.length === 2 ? parts.pop().split(';').shift() : null;
    if (id === null) {
      id = "id" + Math.random().toString(16).slice(2)
      document.cookie = `user_id=${id}; path=/`;
    }
  }

  //Called when a link to a module is clicked
  logModuleAnalytics(name) {
    this.dataService.logAnalytics({ title: name, activity_type: 'open_module' });
  }
}

