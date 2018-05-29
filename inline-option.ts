import {Directive, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {isPresent, isTrueProperty} from "ionic-angular/util/util";

@Directive({
  selector: 'inline-option'
})
export class InlineOption {

  _selected: boolean = false;
  _disabled: boolean = false;
  _value: any;
  _elemId: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
  }

  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(val: boolean) {
    this._selected = isTrueProperty(val);
  }

  @Input()
  get value() {
    if (isPresent(this._value)) {
      return this._value;
    }
    return this.text;
  }
  set value(val: any) {
    this._value = val;
  }

  get elemId() {
    return this._elemId;
  }
  set elemId(val: string) {
    this._elemId = val;
  }

  @Output() inlineSelect: EventEmitter<any> = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  get text() {
    return this._elementRef.nativeElement.textContent;
  }

}
