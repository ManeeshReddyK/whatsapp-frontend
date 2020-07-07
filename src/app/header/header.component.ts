import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() email;
  @Output() logoutEmited = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  logout() {
    this.logoutEmited.emit()
  }
}
