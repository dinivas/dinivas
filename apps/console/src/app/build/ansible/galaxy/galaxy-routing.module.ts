import { RepoContentDetailComponent } from './repo-content-detail/repo-content-detail.component';
import { ProviderListResolver } from './providers/provider-resolver.service';
import { ProvidersComponent } from './providers/providers.component';
import { MySettingsComponent } from './my-settings/my-settings.component';
import { NamespaceListResolver } from './my-content/namespace-list-resolver.service';
import { GalaxyComponent } from './galaxy.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { MyContentComponent } from './my-content/my-content.component';
import { MyImportComponent } from './my-import/my-import.component';
import {RepoContentDetailResolver} from './repo-content-detail/repo-content-detail.resolver.service';

import {
  PopularCloudPlatformsResolver,
  PopularPlatformsResolver,
  PopularTagsResolver,
  SearchCloudPlatformResolver,
  SearchContentResolver,
  SearchPlatformResolver
} from './search/search.resolver.service';

const routes: Routes = [
  {
    path: '',
    component: GalaxyComponent,
    children: [
      {
        path: 'search',
        component: SearchComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          cloudPlatforms: SearchCloudPlatformResolver,
          content: SearchContentResolver,
          platforms: SearchPlatformResolver,
          popularTags: PopularTagsResolver,
          popularCloudPlatforms: PopularCloudPlatformsResolver,
          popularPlatforms: PopularPlatformsResolver
        }
      },
      {
        path: 'my-content',
        component: MyContentComponent,
        resolve: {
          namespaces: NamespaceListResolver
        }
      },
      { path: 'my-import', component: MyImportComponent },
      { path: 'my-settings', component: MySettingsComponent },
      {
        path: 'providers',
        component: ProvidersComponent,
        resolve: {
          providers: ProviderListResolver
        }
      },
      {
        path: ':namespace/:name',
        component: RepoContentDetailComponent,
        resolve: {
            contentType: RepoContentDetailResolver,
        },
    },
      { path: '', redirectTo: 'search' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalaxyRoutingModule {}
