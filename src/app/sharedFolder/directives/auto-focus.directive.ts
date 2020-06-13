import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private eleRef: ElementRef) { }

  ngAfterViewInit() {
    this.eleRef.nativeElement.focus();
  }


}
