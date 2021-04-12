import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  results: any;
  searchQuery: any;
  routeSub: any;
  resultsSub: any;

  constructor(private mdService: MusicDataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.searchQuery = params.q;
      this.resultsSub = this.mdService.searchArtists(this.searchQuery).subscribe(resultsData => {
        let raw = resultsData.artists.items;
        this.results = raw.filter((item: any) => item.images.length > 0);
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.resultsSub.unsubscribe();
  }

}
