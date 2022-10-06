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
  selfUnpurchasedCart: Cart | undefined;
  selfPurchasedCarts: Cart[] | undefined;

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
        this.selfUnpurchasedCart = undefined;
        this.selfPurchasedCarts = undefined;
      }
    });

    this.loadData();
  }

  private loadData() {
    if (this.authService.loggedInUser()?.role === UserRole.User) {
      this.loadSelfUnpurchasedCart();
      this.loadSelfPurchasedCarts();
    }
  }

  private loadSelfPurchasedCarts(): void {
    this.findSelfPurchased().subscribe((result: CartI[]) => {
      if (result == null || result.length === 0) {
        this.selfPurchasedCarts = undefined;
        return;
      }

      this.selfPurchasedCarts = result.map((result) =>
        Object.assign(new Cart(), result)
      );
    });
  }
  private loadSelfUnpurchasedCart(): void {
    this.findSelfUnpurchased().subscribe((result: CartI) => {
      if (result == null) {
        this.selfUnpurchasedCart = undefined;
        return;
      }

      this.selfUnpurchasedCart = Object.assign(new Cart(), result);
    });
  }

  findSelfPurchased(): Observable<CartI[]> {
    return this.http.get<CartI[]>(`/api/carts/purchased`);
  }
  findSelfUnpurchased(): Observable<CartI> {
    return this.http.get<CartI>(`/api/carts/unpurchased`);
  }

  addItemToCart(restaurantItemId: number): Observable<CartItemI> {
    return this.http
      .post<CartItemI>(`/api/carts/items`, {
        restaurantItemId,
      })
      .pipe(
        tap(
          (result: CartItemI) => {
            if (!this.selfUnpurchasedCart) {
              this.loadSelfUnpurchasedCart();
            } else {
              this.selfUnpurchasedCart.updateOrAddItem(result);
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
          this.selfUnpurchasedCart?.deleteItem(id);
          if (this.selfUnpurchasedCart?.cartItems.length == 0) {
            this.selfUnpurchasedCart = undefined;
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
          if (!this.selfUnpurchasedCart) throw new Error("Cart doesn't exists");

          this.selfUnpurchasedCart.updateOrAddItem(result);
        })
      );
  }

  deleteSelfCart(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/carts/${id}`).pipe(
      tap((result) => {
        if (result) {
          this.selfUnpurchasedCart = undefined;
        }
      })
    );
  }
  checkoutCart(): Observable<CartI | null> {
    if (!this.selfUnpurchasedCart) return of(null);

    return this.http
      .patch<CartI>(`/api/carts/${this.selfUnpurchasedCart?.id}`, {})
      .pipe(
        tap((result) => {
          const resultCart = result as CartI;
          if (resultCart.purchased) {
            this.selfUnpurchasedCart = undefined;
          }
        })
      );
  }
}
