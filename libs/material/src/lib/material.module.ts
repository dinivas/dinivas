import { NgModule } from '@angular/core';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatTableModule,
  MatSelectModule,
  MatDialogModule,
  MatGridListModule,
  MatTabsModule,
  MatSortModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatStepperModule,
  MatChipsModule,
  MatSliderModule,
  MatAutocompleteModule,
  MatBadgeModule
} from '@angular/material';

const matModules: any[] = [
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatTableModule,
  MatSelectModule,
  MatDialogModule,
  MatGridListModule,
  MatTabsModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatStepperModule,
  MatChipsModule,
  MatSliderModule,
  MatAutocompleteModule,
  MatBadgeModule
];

@NgModule({
  imports: [...matModules],
  exports: [...matModules]
})
export class MaterialModule {}
