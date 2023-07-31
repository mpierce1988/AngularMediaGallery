import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Create public property to store errors, success message, and loading state
  errors: string[] = [];
  successMessage: string = '';
  loading: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    // Validate form is valid
    if(this.form.valid){
      // Set loading state
      this.loading = true;
      this.authService.register(this.form.value.email, this.form.value.password)
        .subscribe({
          next: (response) => {
            // check response for errors
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
              this.successMessage = 'Registration successful! UserId is ' + response.data?.accountCreate?._id;
              // Clear error message
              this.errors = [];
              // Set loading state
              this.loading = false;
            }
          },
          error: (error) => {
            console.log(error);
            // Clear previous errors
            this.errors = [];
            // Set error messages
            this.errors = error.error.errors;
            // Set loading state
            this.loading = false;
          }
        });
    }
  }
}
