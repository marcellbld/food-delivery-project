import {
  Component,
  DebugElement,
  HostListener,
  NgZone,
  OnInit,
} from '@angular/core';
import { UserRole } from '../../../shared/models/user/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly zone: NgZone
  ) {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', (e) => {
        let element = document.querySelector('.navbar') as HTMLElement;
        this.scrolledDown = window.pageYOffset > element.clientHeight / 2;

        if (this.scrolledDown) {
          element.classList.add('shadow');
          element.classList.add('bg-navbar');
        } else {
          if (!this.collapsed) return;
          element.classList.remove('shadow');
          element.classList.remove('bg-navbar');
        }
      });
    });
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  loggedInUsername(): string {
    return this.authService.loggedInUser()?.username || '';
  }
  loggedInUserRole(): string {
    return this.authService.loggedInUser()?.role || UserRole.User;
  }

  scrolledDown: boolean = false;
  collapsed: boolean = true;

  onClickCollapse() {
    this.collapsed = !this.collapsed;
    if (!this.collapsed) {
      let element = document.querySelector('.navbar') as HTMLElement;
      element.classList.add('shadow');
      element.classList.add('bg-navbar');
    } else {
      if (!this.scrolledDown) {
        setTimeout(() => {
          let element = document.querySelector('.navbar') as HTMLElement;
          element.classList.remove('shadow');
          element.classList.remove('bg-navbar');
        }, 350);
      }
    }
  }

  // @HostListener('show.bs.collapse', ['$event'])
  // onBsCollapseShow() {
  //   console.log('BS COLLAPSE SHOW');
  //   this.opened = true;
  //   let element = document.querySelector('.navbar') as HTMLElement;
  //   element.classList.add('shadow');
  //   element.classList.add('bg-navbar');
  // }

  // @HostListener('hidden.bs.collapse', ['$event'])
  // onBsCollapseHide() {
  //   console.log('BS COLLAPSE HIDE');
  //   this.opened = false;
  //   if (!this.scrolledDown) {
  //     let element = document.querySelector('.navbar') as HTMLElement;
  //     element.classList.remove('shadow');
  //     element.classList.remove('bg-navbar');
  //   }
  // }
}
