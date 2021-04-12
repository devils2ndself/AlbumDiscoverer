import { Component, OnInit } from '@angular/core';
import { RegisterUser } from '../RegisterUser';
import { AuthService } from '../auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  registerUser: RegisterUser = new RegisterUser();
  warning: string | null = null;
  success: Boolean = false;
  loading = false;
  regSub: any;

  constructor(private auth: AuthService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Register');
  }

  onSubmit() {
    if (this.registerUser.userName != "" && this.registerUser.password === this.registerUser.password2) {
      this.loading = true;
      this.regSub = this.auth.register(this.registerUser).subscribe((success) => {
          this.success = true;
          this.warning = null;
          this.loading = false;
        }, (err) => {
          this.success = false;
          this.warning = err.error.message;
          this.loading = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.regSub.unsubscribe();
  }
}