import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css']
})
export class ArtistDiscographyComponent implements OnInit {

  albums: Array<any> = [];
  artist: any;
  routeSub: any;
  artistSub: any;
  albumsSub: any;

  constructor(private route: ActivatedRoute, private mdService: MusicDataService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params=>{
      this.artistSub = this.mdService.getArtistById(params['id']).subscribe(artistData => {
        this.artist = artistData;
      });
      this.albumsSub = this.mdService.getAlbumsByArtistId(params['id']).subscribe(albumsData => {
        const filterSet = new Set();
        this.albums = albumsData.items.reduce((acc: [{name: undefined}], current: {name: undefined}) => {
          const x = acc.find((item: {name: undefined}) => item.name === current.name);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
      });
    });
  }

  ngOnDestroy(): void {
    this.artistSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.albumsSub.unsubscribe();
  }

}
