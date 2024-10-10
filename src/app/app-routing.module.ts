import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { FolderViewComponent } from './folder-view/folder-view.component';
import { FileViewComponent } from './file-view/file-view.component';
import { SearchListComponent } from './search-list/search-list.component';
import { AboutComponent } from './about/about.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { ModuleComponent } from './module/module.component';

import { FoldersResolver } from './resolvers/folders.resolver';
import { ModulesResolver } from './resolvers/modules.resolver';
import { FolderTreeResolver } from './resolvers/folder-tree.resolver';
import { MetadataListResolver } from './resolvers/metadata-list.resolver';
/*Removed dates dropdown*//*import { DatesResolver } from './resolvers/dates.resolver';*/
import { FolderDataResolver } from './resolvers/folder-data.resolver';
import { FileDataResolver } from './resolvers/file-data.resolver';
import { SearchDataResolver } from './resolvers/search-data.resolver';
import { SearchKeywordResolver } from './resolvers/search-keyword.resolver';
import { FullPathResolver } from './resolvers/full-path.resolver';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewToSpellComponent } from './new-to-spell/new-to-spell.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { folders: FoldersResolver, modules: ModulesResolver }
  },
  {
    path: 'home',
    component: HomeComponent,
    resolve: { folders: FoldersResolver, modules: ModulesResolver }
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: 'new-to-spell', component: NewToSpellComponent
  },
  {
    path: 'index',
    component: IndexPageComponent,
    resolve: { folderTree: FolderTreeResolver }
  },
  {
    path: 'content/:folder_id',
    component: FolderViewComponent,
    resolve: { folderData: FolderDataResolver, fullPath: FullPathResolver }
  },
  {
    path: 'content/:folder_id/:subfolder_id',
    component: FolderViewComponent,
    resolve: { folderData: FolderDataResolver, fullPath: FullPathResolver }
  },
  {
    path: 'file-view/:content_id',
    component: FileViewComponent,
    resolve: { fileData: FileDataResolver, fullPath: FullPathResolver }
  },
  {
    path: 'search-list',
    component: SearchListComponent,
    resolve: { metadataList: MetadataListResolver, /*Removed dates dropdown*//*dates: DatesResolver*/ }
  },
  {
    path: 'search-list/keyword/:search_string',
    component: SearchListComponent,
    resolve: { searchResult: SearchKeywordResolver, metadataList: MetadataListResolver, /*Removed dates dropdown*//*dates: DatesResolver*/ }
  },
  {
    path: 'search-list/:search_string',
    component: SearchListComponent,
    resolve: { searchResult: SearchDataResolver, metadataList: MetadataListResolver, /*Removed dates dropdown*//*dates: DatesResolver*/ }
  },
  {
    path: 'module/:id',
    children: [ {
      path: '**',
      component: ModuleComponent
    } ]
  },
  { //404 page
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', //Scroll to top on new page and restore previous scroll height on forward/back
    initialNavigation: 'enabled' //Wait to load website until all resources for the requested page are loaded
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
