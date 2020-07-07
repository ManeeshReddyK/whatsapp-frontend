import { PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'lastMessageTime'
})
export class LastMessageTimePipe implements PipeTransform {
    transform(value: string) {
        var _value = new Date(value);
        var dif = Math.floor(((Date.now() - _value.getTime()) / 1000) / 86400);
        if (dif < 30) {
            return convertToNiceDate(value);
        } else {
            var datePipe = new DatePipe("en-US");
            value = datePipe.transform(value, 'MMM-dd-yyyy');
            return value;
        }
    }
}

function convertToNiceDate(time: string) {
    var date = new Date(time),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        daydiff = Math.floor(diff / 86400);

    if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31)
        return '';

    return daydiff == 0 && (
        diff < 60 && "Just now" ||
        diff < 120 && "1 min ago" ||
        diff < 3600 && Math.floor(diff / 60) + " min ago" ||
        diff < 7200 && "1 hr ago" ||
        diff < 86400 && Math.floor(diff / 3600) + " hr ago") ||
        daydiff == 1 && "Yesterday" ||
        daydiff < 7 && daydiff + " days ago" ||
        daydiff < 31 && Math.ceil(daydiff / 7) + " week(s) ago";
}