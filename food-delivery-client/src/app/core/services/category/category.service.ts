import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryI } from '../../../shared/models/category/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _primaryCategories: CategoryI[] = [];

  constructor(private readonly http: HttpClient) {
    this.loadPrimaryCategories();
  }

  private loadPrimaryCategories() {
    this.findPrimaries().subscribe((result) => {
      this._primaryCategories = result as CategoryI[];
    });
  }

  findPrimaries(): Observable<CategoryI[]> {
    return this.http.get<CategoryI[]>(`/api/categories/primaries`);
  }

  findSecondaries(nameFilter: string): Observable<CategoryI[]> {
    return this.http.get<CategoryI[]>(
      `/api/categories/secondaries/${nameFilter}`
    );
  }

  get primaryCategories(): CategoryI[] {
    return this._primaryCategories;
  }

  filterPrimaryCategories(nameFilter: string): CategoryI[] {
    return this.primaryCategories?.filter((category) =>
      category.name.includes(nameFilter)
    );
  }
}
