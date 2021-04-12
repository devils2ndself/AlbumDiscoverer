import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

  favourites: Array<any> = [];
  favSub: any;

  constructor(private mdService: MusicDataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.favSub = this.mdService.getFavourites().subscribe(favData => {
      this.favourites = favData.tracks;
    });
  }

  removeFromFavourites(id: any) {
    this.favSub.unsubscribe();
    this.favSub = this.mdService.removeFromFavourites(id).subscribe(favData => {
      this.favourites = favData.tracks;
    });
  }

  ngOnDestroy(): void {
    this.favSub.unsubscribe();
  }

}
