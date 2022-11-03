import { Injectable } from '@angular/core';
import { OrderI } from '../../../shared/models/order/order.interface';
import { CreateOrderI } from '../../../shared/models/order/create-order.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../../../shared/models/user/user.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  selfOrders: OrderI[] | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.authService.loginChange$.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.loadSelfOrders();
      } else {
        this.selfOrders = undefined;
      }
    });

    this.loadSelfOrders();
  }

  create(createOrder: CreateOrderI): Observable<OrderI> {
    return this.http.post<OrderI>(`/api/orders`, createOrder);
  }

  private loadSelfOrders() {
    if (this.authService.loggedInUser()?.role === UserRole.Courier) {
      this.findSelfOrders().subscribe((result) => {
        this.selfOrders = result;
      });
      this.findSelfOrders().subscribe((result) => {
        this.selfOrders = result;
      });
    }
  }
  findSelfOrders(): Observable<OrderI[]> {
    return this.http.get<OrderI[]>(`/api/orders/self`);
  }
  findSelfActiveOrder(): Observable<OrderI> {
    return this.http.get<OrderI>(`/api/orders/self-active`);
  }
}
