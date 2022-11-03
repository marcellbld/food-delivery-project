import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { CartI } from '../../../shared/models/cart/cart.interface';
import { Cart } from '../../../shared/models/cart/cart';
import { CartItemI } from '../../../shared/models/cart/cart-item.interface';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../../../shared/models/user/user.interface';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  selfActiveCart: Cart | undefined;
  selfDeliveredCarts: Cart[] | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {
    this.authService.loginChange$.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.loadData();
      } else {
        this.selfActiveCart = undefined;
        this.selfDeliveredCarts = undefined;
      }
    });

    this.loadData();
  }

  private loadData() {
    if (this.authService.loggedInUser()?.role === UserRole.User) {
      this.loadSelfActiveCart();
      this.loadSelfDeliveredCarts();
    }
  }

  private loadSelfDeliveredCarts(): void {
    this.findSelfDelivered().subscribe((result: CartI[]) => {
      if (result == null || result.length === 0) {
        this.selfDeliveredCarts = undefined;
        return;
      }

      this.selfDeliveredCarts = result.map((result) =>
        Object.assign(new Cart(), result)
      );
    });
  }
  private loadSelfActiveCart(): void {
    this.findSelfActive().subscribe((result: CartI) => {
      if (result == null) {
        this.selfActiveCart = undefined;
        return;
      }

      this.selfActiveCart = Object.assign(new Cart(), result);
    });
  }

  findSelfDelivered(): Observable<CartI[]> {
    return this.http.get<CartI[]>(`/api/carts/delivered`);
  }
  findSelfActive(): Observable<CartI> {
    return this.http.get<CartI>(`/api/carts/active`);
  }
  findAllUndelivered(): Observable<CartI[]> {
    return this.http.get<CartI[]>(`/api/carts/undelivered`);
  }

  addItemToCart(restaurantItemId: number): Observable<CartItemI> {
    return this.http
      .post<CartItemI>(`/api/carts/items`, {
        restaurantItemId,
      })
      .pipe(
        tap(
          (result: CartItemI) => {
            if (!this.selfActiveCart) {
              this.loadSelfActiveCart();
            } else {
              this.selfActiveCart.updateOrAddItem(result);
            }
          },
          (response: HttpErrorResponse) => {
            if (response.status === 401) {
              this.router.navigateByUrl('/login');
            } else if (response.status === 400) {
              this.toastService.showErrorToast(response.error.message);
            }
          }
        )
      );
  }
  deleteItem(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/carts/items/${id}`).pipe(
      tap((result) => {
        if (result) {
          this.selfActiveCart?.deleteItem(id);
          if (this.selfActiveCart?.cartItems.length == 0) {
            this.selfActiveCart = undefined;
          }
        }
      })
    );
  }
  modifyItem(id: number, count: number): Observable<CartItemI | undefined> {
    if (count <= 0) return this.deleteItem(id).pipe(map((_) => undefined));

    return this.http
      .patch<CartItemI>(`/api/carts/items/${id}`, {
        count,
      })
      .pipe(
        tap((result: CartItemI) => {
          if (!this.selfActiveCart) throw new Error("Cart doesn't exists");

          this.selfActiveCart.updateOrAddItem(result);
        })
      );
  }

  deleteSelfCart(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/carts/${id}`).pipe(
      tap((result) => {
        if (result) {
          this.selfActiveCart = undefined;
        }
      })
    );
  }
  checkoutCart(): Observable<CartI | null> {
    if (!this.selfActiveCart) return of(null);

    return this.http
      .patch<CartI>(`/api/carts/${this.selfActiveCart?.id}`, {})
      .pipe(
        tap((result) => {
          const resultCart = result as CartI;
          if (resultCart.purchased) {
            this.selfActiveCart = Object.assign(new Cart(), resultCart);
          }
        })
      );
  }
}
