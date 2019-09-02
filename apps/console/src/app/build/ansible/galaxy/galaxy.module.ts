import { RepoContentDetailResolver } from './repo-content-detail/repo-content-detail.resolver.service';
import { ProviderListResolver } from './providers/provider-resolver.service';
import { NamespaceListResolver } from './my-content/namespace-list-resolver.service';
import { SharedModule } from './../../../shared/shared.module';
import { CoreModule } from './../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalaxyRoutingModule } from './galaxy-routing.module';
import { GalaxyComponent } from './galaxy.component';
import { CommonUiModule } from '@dinivas/common-ui';
import {
  MyContentComponent,
  SelectNamespaceDialogComponent,
  SelectRepoDialogComponent
} from './my-content/my-content.component';
import { MyImportComponent } from './my-import/my-import.component';
import { SearchComponent } from './search/search.component';

import {
  PopularCloudPlatformsResolver,
  PopularPlatformsResolver,
  PopularTagsResolver,
  SearchCloudPlatformResolver,
  SearchContentResolver,
  SearchContentTypeResolver,
  SearchPlatformResolver
} from './search/search.resolver.service';
import { MySettingsComponent } from './my-settings/my-settings.component';
import { ProvidersComponent } from './providers/providers.component';
import { RepoContentDetailComponent } from './repo-content-detail/repo-content-detail.component';

@NgModule({
  declarations: [
    GalaxyComponent,
    MyContentComponent,
    MyImportComponent,
    SearchComponent,
    MySettingsComponent,
    ProvidersComponent,
    SelectNamespaceDialogComponent,
    SelectRepoDialogComponent,
    RepoContentDetailComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    GalaxyRoutingModule
  ],
  providers: [
    SearchCloudPlatformResolver,
    SearchContentResolver,
    SearchContentTypeResolver,
    SearchPlatformResolver,
    PopularTagsResolver,
    PopularPlatformsResolver,
    PopularCloudPlatformsResolver,
    NamespaceListResolver,
    ProviderListResolver,
    RepoContentDetailResolver
  ],
  entryComponents: [SelectNamespaceDialogComponent, SelectRepoDialogComponent]
})
export class GalaxyModule {}
