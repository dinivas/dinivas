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
    MatTabsModule
} from '@angular/material';

@NgModule({
    imports: [
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
        MatTabsModule
    ],
    exports: [
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
        MatTabsModule
    ]
})
export class MaterialModule { }