import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DeactivateaccountComponent } from '../sharedFolder/modals/deactivateaccount/deactivateaccount.component';
import { ProfileComponent } from '../sharedFolder/modals/profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() userInfo;
  @Output() logoutEmited = new EventEmitter<any>();
  @Output() deactivateAccountEmited = new EventEmitter<any>();
  dialogRef;

  constructor(private matDialogService: MatDialog) { }

  ngOnInit() {
  }

  logout() {
    this.logoutEmited.emit();
  }

  deactivateAccount() {
    this.dialogRef = this.matDialogService.open(DeactivateaccountComponent, { data: { type: "deactivate" } });
    this.dialogRef.afterClosed()
      .subscribe(flag => {
        if (flag) {
          this.deactivateAccountEmited.emit();
        }
      })
  }

  myProfile() {
    this.dialogRef = this.matDialogService.open(ProfileComponent, { data: { type: "mainUser", user: this.userInfo }, width: "700px" });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  setStyle(imgUrl) {
    return { 'background-image': `url(${imgUrl})` };
  }
}
