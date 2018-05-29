import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {InlineSelect} from './inline-select';
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {InlineOption} from "./inline-option";

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [InlineSelect, InlineOption],
  exports: [InlineSelect, InlineOption],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InlineSelectModule {
}
