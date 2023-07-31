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
            if(response.errors != null && response.errors!.length > 0) {
              // An error or errors has occurred
              // Clear any existing errors
              this.errors = [];
              // loop through errors and add to errors array
              for(let i = 0; i < response.errors!.length; i++) {
                this.errors.push(response.errors![i].message);
              }

              // Set loading state
              this.loading = false;
            } else {
              // No errors occurred
              // Set Success message
              this.successMessage = 'Login successful! UserId is ' + response.data?.accountCreateEmailSession?.$id;
              // Clear error message
              this.errors = [];
              // Set loading state
              this.loading = false;
            }
          },
          error: (error) => {
            console.log(error);
            // Clear any existing errors
            this.errors = [];
            // Set Error Message
            this.errors = error.error.errors;
            // Set loading state
            this.loading = false;
          }
        });
    }
  }
}
