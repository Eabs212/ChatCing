import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhotoService } from 'src/providers/photo.service';
import { UtilsService } from 'src/app/utils.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-line-list',
  templateUrl: './time-line-list.component.html',
  styleUrls: ['./time-line-list.component.scss'],
})
export class TimeLineListComponent implements OnInit, OnDestroy {

  list;
  media$: Subscription;
  constructor(private media: PhotoService, private utils: UtilsService, private view: PhotoViewer) { }

  ngOnInit() {
    this.media$ = this.media.getTimeLine().subscribe(data => {
        data.map(ele => {
          const date = ele.date;
          console.log(ele.storageUrl);
          ele.date = this.utils.getBeautifiedDate(date);
          if (ele.date === 'delete') {
            console.log(ele.url);
            const res = this.media.deleteState(ele);
            console.log(res);
    }
          setInterval(() => {
            console.log(ele.storageUrl);
            ele.date = this.utils.getBeautifiedDate(date);
            if (ele.date === 'delete') {
                  console.log(ele.url);
                  const res = this.media.deleteState(ele);
                  console.log(res);
          }
          }, 60000);

        });
        this.list = data.reverse(); });
  }
  showPic(url) {
    this.view.show(url, 'Photo', {share: true});
  }
  ngOnDestroy(): void {
  this.media$.unsubscribe();
  }
}
