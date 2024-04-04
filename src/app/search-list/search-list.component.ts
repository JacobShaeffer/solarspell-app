import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SearchData } from '../models/search-data';
import { Content } from '../models/content';
import { Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Event } from '@angular/router';

//***************************************************************************************************
// Currently the first digit of metadata is used to store which dropdown it corresponds with. Therefore,
// only 10 dropdowns are currently allowed. If more are required, the code must be modified.
//***************************************************************************************************

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})

export class SearchListComponent implements OnInit {
  public contentList :Array<Content> = [];
  public searchString: string = ""; // the search string/keyword passed through the router for search
  public metadataList = [];
  public searchData: SearchData;
  public expandAdvanced: boolean;
  public  math = Math;
  public metaTracker : Array<any> = [];
  //Removed dates dropdown
  //public dropyears: Array<number> = [];
  public previousSearch: Subscription;
  public loading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public dataService:DataService,
    public router: Router,
    public tableElement: ElementRef,
    public viewportScroller: ViewportScroller
  ) {
    this.searchData = new SearchData();
    this.searchData.metadata = [];
  }

  

  ngOnInit(): void {
    //Restore scroll position on page load
    //Prevent scrolling to the top when "Search" button is clicked
    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd && history.state.scrollPosition != undefined) {
        this.viewportScroller.scrollToPosition(history.state.scrollPosition);
      }
    });

    //Executes everytime the route parameters change and when the component is initially loaded
    this.route.params.subscribe(() => {
      if(this.route.snapshot.data.searchResult){ //True if current search is a basic search
        this.expandAdvanced = false;

        //Get component content from resolvers
        this.searchString = this.route.snapshot.data.searchResult.searchString;
        this.contentList = this.route.snapshot.data.searchResult.contentList;
        console.log("search string", this.searchString);
        console.log("content list count", this.contentList.length);

        //Initialize activity_type to 'search', then change to 'keyword_search' if url matches a keyword search
        var activity_type = 'search';

        if(this.router.url.slice(0,21) == '/search-list/keyword/') {
          activity_type = 'keyword_search';
        }

        if(this.contentList.length == 0) {
          activity_type = 'search_no_results';
        }

        this.dataService.logAnalytics({ title: this.searchString, activity_type: activity_type });
      }
      else { //Current search is an advanced search
        this.expandAdvanced = true;
        this.searchString = "";
      }
    });

    //Generate dropyears from dates resolver
    //Removed dates dropdown
    /*
    var minDate: Date = new Date(this.route.snapshot.data.dates.min);
    var maxDate: Date = new Date(this.route.snapshot.data.dates.max);

    var minYear = minDate.getFullYear() + 1;
    var maxYear = maxDate.getFullYear() + 2;

    for(var j = maxYear; j >= minYear; j--) {
      this.dropyears.push(j);
    }
    */
    
    //Get metadataList from resolver
    this.metadataList = this.route.snapshot.data.metadataList;

    //Get parameters from url
    var params = this.route.snapshot.queryParams;

    //Set this.searchData to url parameters unless url parameter is undefined
    if(params['title'] != undefined) {
      this.searchData.title = params['title'];
    }
    else {
      this.searchData.title = '';
    }

    //Removed dates dropdown
    /*
    if(params['min_date'] != undefined) {
      this.searchData.min_date = params['min_date'];
    }
    else {
      this.searchData.min_date = '';
    }

    if(params['max_date'] != undefined) {
      this.searchData.max_date = params['max_date'];
    }
    else {
      this.searchData.max_date = '';
    }
    */

    //Deselect/initialize all dropdown options
    for(var i = 0; i < this.metaTracker.length; i++) {
      this.metaTracker[i] = [];
    }

    //Set dropdown options if url parameter 'metadata' is defined
    if(params['metadata'] != undefined) {
      var metadata;

      //Ensure metadata is stored in an array even if there is only a single metadata parameter
      if(Array.isArray(params['metadata'])) {
        metadata = params['metadata'];
      }
      else {
        metadata = [params['metadata']];
      }

      //Get type of ids in metadataList
      var firstId = this.metadataList[0].metadata[0].id;
      var idType = typeof firstId;

      //Loop through metadata and store each element in the corresponding metaTracker (linked with a dropdown)
      for(let meta of metadata) {
        if(this.metaTracker[meta[0]] == undefined) {
          this.metaTracker[meta[0]] = [];
        }

        //Match the type of ids from metadataList with metaTracker ids
        var metaId = (idType == 'number') ? parseInt(meta.slice(1)) : meta.slice(1);
        this.metaTracker[meta[0]].push(metaId);
      }
    }

    if(this.searchString == '') { //True if user is not doing a basic search
      this.searchAdvanced(false);
    }
  }

  /*
  If scroll is true, the page will scroll to the table when completed. Scroll
  should be true when the user clicks "Search" but false when they navigate to
  the page.

  searchAdvanced() takes the existing states of the advanced search form, performs
  a search, and updates the content table
  */
  searchAdvanced(scroll: boolean) {
    this.loading = true;

    //paramMeta = metadata pushed to url
    //this.searchData.metadata = metadata used for advanced search
    var paramMeta = [];
    this.searchData.metadata = [];

    //Loop through metaTracker and add each element to paramMeta and searchData.metadata
    this.metaTracker.forEach((tracker, index) => {
      tracker.forEach(element => {
        //id of index is the first digit of each paramMeta element
        paramMeta.push('' + index +  element);
        this.searchData.metadata.push(element);
      });
    });
    
    //Interface used to store url parameters
    interface ParamData {
      title?: string;
      metadata?: any;
      //Removed dates dropdown
      /*
      min_date?: string;
      max_date?: string;
      */
    }

    var paramData: ParamData = {};

    //Store url parameters in paramData if defined
    if(this.searchData.title != '') {
      paramData.title = this.searchData.title;
    }

    //Removed dates dropdown
    /*
    if(this.searchData.min_date != '') {
      paramData.min_date = this.searchData.min_date;
    }

    if(this.searchData.max_date != '') {
      paramData.max_date = this.searchData.max_date;
    }
    */

    if(paramMeta.length != 0) {
      paramData.metadata = paramMeta;
    }

    //Push url parameters if current page is not a basic search. Otherwise, navigate to /search-list and push url parameters
    //(if statement prevents unnecessary reloading of the search-list component)
    if(this.searchString == '') {
      //Push url parameters
      this.router.navigate([], {
        queryParams: paramData,
        state: { scroll: scroll, scrollPosition: this.viewportScroller.getScrollPosition() }
      });

      //Terminate previous search if not completed
      if(this.previousSearch != undefined && !this.previousSearch.closed) {
        this.previousSearch.unsubscribe();
      }

      //Perform advanced search
      this.previousSearch = this.dataService.advancedSearch(this.searchData)
      .subscribe( response  => {
        this.contentList = response;
        this.loading = false;

        if(scroll || history.state.scroll) { //True if the user clicked 'advanced_search'
          setTimeout(this.scrollToTable, 0);

          var analytics = { activity_type: 'advanced_search' };

          //Get analytics from searchData
          ['title', /*Removed dates dropdown*//*'min_date', 'max_date'*/].forEach(column => {
            if(this.searchData[column] != '') {
              analytics[column] = this.searchData[column];
            }
          });

          //Convert stored metadata from id to string
          var metadataAnalytics = this.metaTracker.map((tracker, i) => {
            return {
              name: this.metadataList[i].name,
              metadata: tracker.map(element => 
                this.metadataList[i].metadata.find(reference =>
                  reference.id == element).meta_name
              )
            }
          });
          
          //Store each type of metadata in its corresponding analytics column
          metadataAnalytics.forEach(element => {
            //Don't store if no metadata exists
            if(element.metadata.length == 0) {
              return;
            }

            var column;

            switch(element.name) {
              case 'Language':
                column = 'language';
                break;
              case 'Keywords':
                column = 'keyword';
                break;
              case 'Creator':
                column = 'creator';
                break;
              case 'Resource Type':
                column = 'content_type';
                break;
              case 'Audience':
                column = 'audience';
                break;
              case 'Subject':
                column = 'subject';
                break;
              case 'Format':
                column = 'format';
                break;
              case 'Rights Holder':
                column = 'rights_holder';
                break;
            }

            analytics[column] = '';

            //Add each metadata to the column
            element.metadata.forEach((meta, i) => {
              analytics[column] += meta;
              if(i != element.metadata.length - 1) { //Don't add a comma for the last element
                analytics[column] += ', ';
              }
            });
          });

          this.dataService.logAnalytics(analytics);
        }
      });
    }
    else {
      //Navigate to /search-list and push url parameters
      this.router.navigate(['/search-list'], {
        queryParams: paramData,
        state: { scroll: scroll, scrollPosition: this.viewportScroller.getScrollPosition() }
      });
    }
  }

  scrollToTable() {
    let el = document.getElementById('contentList');
    window.scrollTo({ top: el.offsetTop - 15, behavior: 'smooth' });
  }

  startsWithSearchFn(item, metadata) {
    return metadata.meta_name.toLowerCase().startsWith(item.toLowerCase());
  }
}