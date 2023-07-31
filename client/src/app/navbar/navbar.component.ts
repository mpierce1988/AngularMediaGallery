import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    this.subscription = this.authService.loggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  logout() {
    this.authService.logout().subscribe((response) => {
      if(response){        
        this.router.navigate(['/login']);
      }
    })
  }

}
