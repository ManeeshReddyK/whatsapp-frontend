import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fileSelected: File;
  @ViewChild('profileImage') profileImage;
  uploadButton: boolean = false;
  spinner: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, public dialogRef: MatDialogRef<ProfileComponent>) { }

  ngOnInit() {
  }

  onFileChange(event) {
    this.uploadButton = true;
    this.fileSelected = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      this.profileImage.nativeElement.setAttribute("src", e.target['result']);
    }
    reader.readAsDataURL(this.fileSelected);
  }

  onUpload() {
    this.uploadButton = false;
    this.spinner = true;
    this.apiService.userImageUpload(this.fileSelected)
      .subscribe((response: any) => {
        this.apiService.userImageChanged.next(response.data);
        this.spinner = false;
      }, () => {
        this.profileImage.nativeElement.setAttribute("src", this.data.user.profileImage);
        this.spinner = false;
      })
  }

}
