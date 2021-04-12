import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { User } from '../User'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = {userName: "", password: "", _id: null};
  warning: string | null = null;
  loading = false;
  loginSub: any;

  constructor(private auth: AuthService, private router:Router, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }

  onSubmit(): void {
    if (this.user.userName != "" && this.user.password != "") {
      this.loading = true;
      this.loginSub = this.auth.login(this.user).subscribe((success) => {
          this.loading = false;
          localStorage.setItem('access_token', success.token);
          this.router.navigate(['/newReleases']);
        }, (err) => {
          this.warning = err.error.message;
          this.loading = false;
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}