import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Create public property to store errors, success message, and loading state
  errors: string[] = [];
  successMessage: string = '';
  loading: boolean = false;

  // Create FormGroup
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService) {}

  reset() {
    this.errors = [];
    this.successMessage = '';
    this.form.value.email = '';
    this.form.value.password = '';
  }

  onSubmit() {
    // Validate form is valid
    if(this.form.valid){
      // Set loading state
      this.loading = true;

      // Call AuthService to login
      this.authService.login(this.form.value.email, this.form.value.password)
        .subscribe({
          next: (response) => {
            console.log(response);
            // Set sucess message
            this.successMessage = 'Login successful!';
            // set loading state
            this.loading = false;
          },
          error: (error) => {
            console.log(error);
            // Set Error Message
            this.errors = error.error.errors;
            // Set loading state
            this.loading = false;
          }
        });
    }
  }
}
