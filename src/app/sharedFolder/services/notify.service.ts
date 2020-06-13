import { Injectable } from '@angular/core';
declare const $: any;

@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    constructor() { }

    notificationMessage(toasterMsg, toasterType) {

        $.notify({
            icon: 'add_alert',
            message: toasterMsg
        }, {
            type: toasterType,
            delay: 2000,
            timer: 1000,
            placement: {
                from: 'top',
                align: 'right'
            },
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-raised-button type="button" aria-hidden="true" class="close" style="outline:none;" data-notify="dismiss">' +
                '<i class="material-icons" style="position: relative;top: 4px;font-size: 14px;right: -6px;">close</i></button>' +
                '<i class="material-icons" data-notify="icon">notifications</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message" style="color:black;position:relative;top:-6px;" >{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" ' +
                'aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
    }
}
