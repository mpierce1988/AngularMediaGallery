import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    // Validate form is valid
    if(this.form.valid){
      this.authService.login(this.form.value.email, this.form.value.password)
        .subscribe({
          next: (response) => {
            console.log(response);
            // Handle successful login
          },
          error: (error) => {
            console.log(error);
            // Handle Error
          }
        });
    }
  }
}
