import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    // Validate form is valid
    if(this.form.valid){
      this.authService.register(this.form.value.email, this.form.value.password)
        .subscribe({
          next: (response) => {
            console.log(response);
            // Handle successful registration
          },
          error: (error) => {
            console.log(error);
            // Handle error
          }
        });
    }
  }
}
