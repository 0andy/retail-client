import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberConfirmComponent } from './member-confirm.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        MemberConfirmComponent
    ],
    exports: [
        MemberConfirmComponent
    ]
})
export class MemberConfirmModule { }