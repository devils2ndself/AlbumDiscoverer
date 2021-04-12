import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';

import { mergeMap } from 'rxjs/operators';

import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient) { }  

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(
        "https://api.spotify.com/v1/browse/new-releases", 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
    }));
  }

  getArtistById(id: string): Observable<SpotifyApi.SingleArtistResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token => {
      return this.http.get<any>(
        `https://api.spotify.com/v1/artists/${id}`, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
    }));
  }

  getAlbumsByArtistId(id: string): Observable<any> /*Spotify type causes issues and I really have no time so I left it as any*/ { 
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token => {
      // avoiding magic numbers in queries
      const include_groups = "album,single";
      const limit = 50;
      return this.http.get<any>(
        `https://api.spotify.com/v1/artists/${id}/albums?include_groups=${include_groups}&limit=${limit}`, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
    }));
  }

  getAlbumById(id: string): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token => {
      return this.http.get<any>(
        `https://api.spotify.com/v1/albums/${id}`, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
    }));
  }

  searchArtists(searchString: string): Observable<SpotifyApi.ArtistSearchResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token => {
      // avoiding magic numbers in queries
      const type = "artist";
      const limit = 50;
      return this.http.get<any>(
        `https://api.spotify.com/v1/search?q=${searchString}&type=${type}&limit=${limit}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
    }));
  }

  /*addToFavourites(id: string) {
    if (id != null && id != undefined && this.favouritesList.length < 50 && !this.favouritesList.includes(id)) {
      this.favouritesList.push(id);
      return true;
    } else return false;
  }*/

  addToFavourites(id: string): Observable<[String]> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.put<[String]>(
        `${environment.userAPIBase}/favourites/${id}`, 
        { headers: { "Authorization": `Bearer ${token}` } }
        );
    }));
  }

  /*removeFromFavourites(id: string): Observable<any> {
    this.favouritesList.splice(this.favouritesList.indexOf(id), 1);
    return this.getFavourites();
  }*/
  
  removeFromFavourites(id: string): Observable<SpotifyApi.MultipleTracksResponse> {
    return this.http.delete<[String]>(`${environment.userAPIBase}/favourites/${id}`).pipe(mergeMap(favouritesArray => {
      if (favouritesArray.length > 0){
        return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
          return this.http.get<any>(
            `https://api.spotify.com/v1/tracks?ids=${favouritesArray.join(',')}`, 
            { headers: { "Authorization": `Bearer ${token}` } }
            );
        })); 
      } else return new Observable(o => o.next({tracks: []}));
    }));
  }

  /*getFavourites(): Observable<any> {
    if (this.favouritesList.length > 0) {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token => {
        return this.http.get<any>(
          `https://api.spotify.com/v1/tracks?ids=${this.favouritesList.join(',')}`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
      }));
    } else return new Observable(o=>{o.next([])});
  }*/

  getFavourites(): Observable<SpotifyApi.MultipleTracksResponse> {
    return this.http.get<[String]>(`${environment.userAPIBase}/favourites/`).pipe(mergeMap(favouritesArray => {
      return this.spotifyToken.getBearerToken().pipe(mergeMap((token) => {
          if (favouritesArray.length > 0) return this.http.get<any>(
              `https://api.spotify.com/v1/tracks?ids=${favouritesArray.join(',')}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
           else return new Observable(o => o.next({tracks: []}));
        })
      );
    }));
  }

}