import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserRole } from '../../../shared/models/user/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HomePageComponent } from '../../../home/components/home-page/home-page.component';
import { LoginPageComponent } from '../../../login/components/login-page/login-page.component';
import { SharedModule } from '../../../shared/shared.module';

import { NavbarComponent } from './navbar.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RegistrationPageComponent } from '../../../registration/components/registration-page/registration-page.component';
import { ProfilePageComponent } from '../../../profile/components/profile-page/profile-page.component';
import { NgZone } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let location: Location;

  let authService: any;

  beforeEach(async () => {
    const authServiceMock = {
      isLoggedIn: jest.fn(),
      loggedInUser: jest.fn(),
    } as Partial<AuthService>;
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomePageComponent },
          { path: 'login', component: LoginPageComponent },
          { path: 'registration', component: RegistrationPageComponent },
          { path: 'profile', component: ProfilePageComponent },
        ]),
        SharedModule,
      ],
      declarations: [NavbarComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let nativeElement: any;
  beforeEach(() => {
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  describe('Layout', () => {
    describe('Base', () => {
      it('has logo button', () => {
        const logo = nativeElement.querySelector('a[data-testid="logo"]');
        expect(logo).toBeTruthy();
      });
      it('has logo image', () => {
        const img = nativeElement.querySelector('img[id="site-logo"]');
        expect(img).toBeTruthy();
      });
      it('has site title', () => {
        const siteTitle = nativeElement.querySelector('span[id="site-title"]');
        expect(siteTitle).toBeTruthy();
      });
      it('has search form', () => {
        const searchForm = nativeElement.querySelector('form[role="search"]');
        expect(searchForm).toBeTruthy();
      });
      it('has search input with type of search', () => {
        const searchInput = nativeElement.querySelector('input[type="search"]');
        expect(searchInput).toBeTruthy();
      });
      it('has search button', () => {
        const searchButton = nativeElement.querySelector(
          'button[data-testid="search-button"]'
        );
        expect(searchButton).toBeTruthy();
      });
      it('has Home link with icon', () => {
        const homeLink = nativeElement.querySelector(
          'a[data-testid="home-button"]'
        );
        const icon = homeLink.querySelector('i');
        expect(homeLink).toBeTruthy();
        expect(homeLink.textContent).toEqual('Home');
        expect(icon).toBeTruthy();
      });
    });
    describe('Not Logged In', () => {
      beforeEach(() => {
        authService.isLoggedIn.mockReturnValue(false);
        fixture.detectChanges();
      });
      it('should not display User button', () => {
        const userButton = nativeElement.querySelector(
          'div[data-testid="user-button"]'
        );
        expect(userButton).toBeFalsy();
      });
      it('should not display Sidebar button', () => {
        const sidebarButton = nativeElement.querySelector(
          'div[data-testid="sidebar-button"]'
        );
        expect(sidebarButton).toBeFalsy();
      });
      it('has Login link with icon', () => {
        const loginLink = nativeElement.querySelector(
          'a[data-testid="login-button"]'
        );
        const icon = loginLink.querySelector('i');
        expect(loginLink).toBeTruthy();
        expect(loginLink.textContent).toEqual('Login');
        expect(icon).toBeTruthy();
      });
      it('has Registration link with icon', () => {
        const registrationLink = nativeElement.querySelector(
          'a[data-testid="registration-button"]'
        );
        const icon = registrationLink.querySelector('i');
        expect(registrationLink).toBeTruthy();
        expect(registrationLink.textContent).toEqual('Registration');
        expect(icon).toBeTruthy();
      });
    });
    describe('Logged In', () => {
      beforeEach(() => {
        authService.isLoggedIn.mockReturnValue(true);
        authService.loggedInUser.mockReturnValue({
          id: 1,
          username: 'user1',
          role: UserRole.User,
          createdAt: new Date('now'),
        });
        fixture.detectChanges();
      });

      it('should not display Login link', () => {
        const loginButton = nativeElement.querySelector(
          'div[data-testid="login-button"]'
        );
        expect(loginButton).toBeFalsy();
      });
      it('should not display Registration link', () => {
        const registrationButton = nativeElement.querySelector(
          'div[data-testid="registration-button"]'
        );
        expect(registrationButton).toBeFalsy();
      });
      it('has User button with icon', () => {
        const userButton = nativeElement.querySelector(
          'a[data-testid="user-button"]'
        );

        const icon = userButton.querySelector('i');
        expect(userButton).toBeTruthy();
        expect(icon).toBeTruthy();
      });
      it(`should display User's username on User button`, () => {
        const userLink = nativeElement.querySelector(
          'a[data-testid="user-button"]'
        );

        const usernameText = userLink.querySelector('span');
        expect(usernameText.textContent).toEqual('user1');
      });
      it('has sidebar navigation button', () => {
        const sidebarButton = nativeElement.querySelector(
          'button[data-testid="sidebar-button"]'
        );
        expect(sidebarButton).toBeTruthy();
      });
      describe('as User', () => {
        it('should assign correct element class on User button', () => {
          const userLink = nativeElement.querySelector(
            'a[data-testid="user-button"]'
          );

          expect(userLink.classList).toContain('btn-primary');
        });
      });

      describe('as Owner', () => {
        beforeEach(() => {
          authService.loggedInUser.mockReturnValue({
            id: 2,
            username: 'owner1',
            role: UserRole.Owner,
            createdAt: new Date('now'),
          });
          fixture.detectChanges();
        });
        it('should assign correct element class on User button', () => {
          const userLink = nativeElement.querySelector(
            'a[data-testid="user-button"]'
          );

          expect(userLink.classList).toContain('btn-orange');
        });
      });
    });
  });
  describe('Interactions', () => {
    it('should navigate to /login when clicking on Login button', () => {
      const loginLink = nativeElement.querySelector(
        'a[data-testid="login-button"]'
      ) as HTMLAnchorElement;

      loginLink.click();
      fixture.detectChanges();

      expect(location.path()).toEqual('/login');
    });
    it('should navigate to /registration when clicking on Registration button', () => {
      const registrationLink = nativeElement.querySelector(
        'a[data-testid="registration-button"]'
      ) as HTMLAnchorElement;

      registrationLink.click();
      fixture.detectChanges();

      expect(location.path()).toEqual('/registration');
    });
    it('should navigate to /profile when clicking on User button', () => {
      authService.isLoggedIn.mockReturnValue(true);
      fixture.detectChanges();

      const userLink = nativeElement.querySelector(
        'a[data-testid="user-button"]'
      );

      userLink.click();
      fixture.detectChanges();

      expect(location.path()).toEqual('/profile');
    });
    it('should navigate to / when clicking on Logo and the current url is not /', fakeAsync(() => {
      router.navigate(['login']);
      tick();

      const logo = nativeElement.querySelector(
        'a[data-testid="logo"]'
      ) as HTMLAnchorElement;

      logo.click();
      tick();

      expect(location.path()).toEqual('/');
    }));
    it('should navigate to / when clicking on Home button and the current url is not /', fakeAsync(() => {
      router.navigate(['login']);
      tick();

      const homeButton = nativeElement.querySelector(
        'a[data-testid="home-button"]'
      ) as HTMLAnchorElement;

      homeButton.click();
      tick();

      expect(location.path()).toEqual('/');
    }));
  });
  describe('Class', () => {
    describe('isLoggedIn', () => {
      it('should call authService.isLoggedIn', () => {
        const spyObj = jest.spyOn(authService, 'isLoggedIn');
        spyObj.mockReset();

        component.isLoggedIn();

        expect(authService.isLoggedIn).toHaveBeenCalled();
      });

      describe('Logged in', () => {
        beforeEach(() => {
          authService.isLoggedIn.mockReturnValue(true);
          authService.loggedInUser.mockReturnValue({
            id: 1,
            username: 'user1',
            role: UserRole.User,
            createdAt: new Date('now'),
          });
          fixture.detectChanges();
        });
        it('should return true', () => {
          expect(component.isLoggedIn()).toBeTruthy();
        });
      });
      describe('Not Logged in', () => {
        beforeEach(() => {
          authService.isLoggedIn.mockReturnValue(false);
          fixture.detectChanges();
        });
        it('should return false', () => {
          expect(component.isLoggedIn()).toBeFalsy();
        });
      });
    });
    describe('loggedInUsername', () => {
      it('should call authService.loggedInUser', () => {
        const spyObj = jest.spyOn(authService, 'loggedInUser');
        spyObj.mockReset();

        component.loggedInUsername();

        expect(authService.loggedInUser).toHaveBeenCalled();
      });
      describe('Logged in', () => {
        beforeEach(() => {
          authService.isLoggedIn.mockReturnValue(true);
          authService.loggedInUser.mockReturnValue({
            id: 1,
            username: 'user1',
            role: UserRole.User,
            createdAt: new Date('now'),
          });
          fixture.detectChanges();
        });
        it('should return correct username', () => {
          expect(component.loggedInUsername()).toEqual('user1');
        });
      });
      describe('Not Logged in', () => {
        beforeEach(() => {
          authService.isLoggedIn.mockReturnValue(false);
          fixture.detectChanges();
        });
        it('should return empty string', () => {
          expect(component.loggedInUsername()).toEqual('');
        });
      });
    });
  });
});
