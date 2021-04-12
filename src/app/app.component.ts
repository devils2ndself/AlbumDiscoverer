/*********************************************************************************
* WEB422 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Artem Tanyhin    Student ID: 107958209     Date: 2021/03/28
*
********************************************************************************/

// My account (log pass) - Artem 123

import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  searchString: string = '';
  title = 'album-discoverer';
  token: any;
  eventSub:any;

  constructor(private router: Router, private auth:AuthService) {}

  ngOnInit() {
    this.eventSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.token = this.auth.readToken();
      }
    });
  }

  handleSearch() {
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchString },
    });
    this.searchString = '';
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }
}
