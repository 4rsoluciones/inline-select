import {
  Component, ContentChildren, ElementRef, Input, OnDestroy, Optional, QueryList, Renderer,
  ViewEncapsulation
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {BaseInput} from "ionic-angular/util/base-input";
import {App, Config, Form, Item} from "ionic-angular";
import {InlineOption} from "./inline-option";
import {assert, deepCopy, deepEqual, isCheckedProperty, isTrueProperty} from "ionic-angular/util/util";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'inline-select',
  template:
    '<div *ngFor="let i = index; let op of _options.toArray()" ' +
      '(click)="optionClicked(op)" ' +
      'class="is-option" ' +
      '[ngClass]="op._elementRef.nativeElement.className" ' +
      '[class.selected]="getValues().indexOf(op.value) > -1" ' +
      '[class.disabled]="op.disabled" ' +
      'id="{{op.elemId}}" ' +
      '[innerHtml]="sanitizer.bypassSecurityTrustHtml(op._elementRef.nativeElement.innerHTML)">' +
    '</div>',
  host: {
    'item-content': '',
    '[class.select-disabled]': '_disabled'
  },
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: InlineSelect, multi: true}],
  encapsulation: ViewEncapsulation.None
})
export class InlineSelect extends BaseInput<any> implements OnDestroy {

  _multi: boolean = false;
  _options: QueryList<InlineOption>;
  _compareWith: (o1: any, o2: any) => boolean = isCheckedProperty;

  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }

  constructor(
    private _app: App,
    form: Form,
    public config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() item: Item,
    private sanitizer: DomSanitizer
  ) {
    super(config, elementRef, renderer, 'inline-select', [], form, item, null);
  }

  getValues(): any[] {
    const values = Array.isArray(this._value) ? this._value : [this._value];
    assert(this._multi || values.length <= 1, 'single only can have one value');
    return values;
  }

  @Input()
  get multiple(): any {
    return this._multi;
  }

  set multiple(val: any) {
    this._multi = isTrueProperty(val);
  }

  @ContentChildren(InlineOption)
  set options(val: QueryList<InlineOption>) {
    val.forEach((item: InlineOption, index: number) => {
      item.elemId = 'is-option-' + index;
    });
    this._options = val;
    const values = this.getValues();
    if (values.length === 0) {
      this.value = val.filter(o => o.selected).map(o => o.value);
      if (!this._multi) {
        let value = deepCopy(this.value);
        if (Array.isArray(value)) {
          this.value = value[0];
        }
      }
    } else {
      this._updateView();
    }
  }

  _inputShouldChange(val: string[]|string): boolean {
    return !deepEqual(this._value, val);
  }

  _updateView() {
    if (this._multi) {
      if (!Array.isArray(this.value)) {
        this.value = [this.value];
      }
    }
    if (this._options) {
      this._options.forEach(option => {
        option.selected = this.getValues().some(selectValue => {
          return this._compareWith(selectValue, option.value);
        });

        if (option.selected) {
          let opElem = document.getElementById(option.elemId);
          if (opElem) {
            this._scrollIntoViewH(opElem);
          }
        }
      })
    }
  }

  _scrollIntoViewH(elem: HTMLElement) {
    if (elem.parentElement.scrollLeft > (elem.offsetLeft - elem.parentElement.offsetLeft)) {
      elem.parentElement.scrollTo(elem.offsetLeft - elem.parentElement.offsetLeft, 0);
    } else if ((elem.parentElement.offsetWidth + elem.parentElement.scrollLeft) < (elem.offsetLeft + elem.offsetWidth - elem.parentElement.offsetLeft)) {
      elem.parentElement.scrollTo((elem.offsetLeft + elem.offsetWidth - elem.parentElement.offsetLeft - elem.parentElement.offsetWidth), 0);
    }
  }

  _inputUpdated() {
    this._updateView();
    super._inputUpdated();
  }

  optionClicked(op: InlineOption) {
    if (!op.disabled) {
      if (this._multi) {
        let index = this.getValues().indexOf(op.value);
        if (index > -1) {
          let value = deepCopy(this.value);
          value.splice(index, 1);
          this.value = value;
        } else {
          let value = deepCopy(this.value);
          value.push(op.value);
          this.value = value;
          op.inlineSelect.emit(op.value);
        }
      } else {
        if (this.value !== op.value) {
          this.value = op.value;
          op.inlineSelect.emit(op.value);
        } else {
          this.value = null;
        }
      }
    }
  }

}
