import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket, faChevronLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, LoadingComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
    router = inject(Router)

  faRightFromBracket = faRightFromBracket
  faChevronLeft = faChevronLeft
  faGear = faGear
  user: any = []
  level: number = 0
  totalConquistas = 15;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }


    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        const userString = localStorage.getItem('user');
        if (userString) {
          this.user = JSON.parse(userString);
          this.level = this.user.nivel;
        }
      }
    }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
