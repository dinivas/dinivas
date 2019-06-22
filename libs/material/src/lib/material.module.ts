import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    MatDialogModule
} from '@angular/material';

@NgModule({
    imports: [
        FlexLayoutModule,
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
        MatDialogModule
    ],
    exports: [
        FlexLayoutModule,
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
        MatDialogModule
    ]
})
export class MaterialModule { }