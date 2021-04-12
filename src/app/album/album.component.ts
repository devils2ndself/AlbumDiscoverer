import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MusicDataService } from '../music-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album: any;
  routeSub: any;
  albumSub: any;

  constructor(private mdService: MusicDataService, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.albumSub = this.mdService.getAlbumById(params.id).subscribe(albumData => {
        this.album = albumData;
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.albumSub.unsubscribe();
  }

  addToFavourites(trackID: any) {
    /*if (this.mdService.addToFavourites(trackID)) {
      this.snackBar.open("Added to Favourites", "Done.", {duration: 1500});
    } else this.snackBar.open("Whoops... Already in Favourites", "Ok.", {duration: 1500});*/
    this.mdService.addToFavourites(trackID).subscribe(
      (success) => { this.snackBar.open('Adding to Favorites...', 'Done', {duration: 1500}); },
      (err) => { this.snackBar.open('Whoops... Unable to add song to Favourites', 'Ok', {duration: 1500}); }
    );
  }

}
