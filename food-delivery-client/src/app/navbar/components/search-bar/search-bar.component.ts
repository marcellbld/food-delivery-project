import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { CategoryService } from '../../../core/services/category/category.service';
import { CategoryI } from '../../../shared/models/category/category.interface';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  form = new FormGroup({
    search: new FormControl(''),
  });

  subscriptions = new Array<Subscription>();

  restaurants: RestaurantI[] = [];
  categories: CategoryI[] = [];

  private loadingRestaurants = false;
  private loadingCategories = false;

  constructor(
    private restaurantService: RestaurantService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.form
        .get('search')!
        .valueChanges.pipe(distinctUntilChanged(), debounceTime(200))
        .subscribe(() => {
          this.searchByText(this.searchText);
        })
    );
    this.router.events.subscribe((_) => {
      this.showSearchDropdown = false;
      this.search.reset();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  showSearchDropdown: boolean = false;

  get searchText(): string {
    return this.searchInput?.nativeElement.value.trim() || '';
  }

  get loading(): boolean {
    return this.loadingRestaurants || this.loadingCategories;
  }

  get search() {
    return this.form.get('search')!;
  }

  onInputSearch($event: any) {
    const searchText = this.searchText;

    if (searchText === '') {
      this.showSearchDropdown = false;
      this.categories = [];
      this.restaurants = [];
    } else {
      this.showSearchDropdown = true;
    }
  }

  onClickSearchButton($event: any) {
    this.showSearchDropdown = true;
  }

  private searchByText(searchText: string) {
    if (searchText === '') {
      this.restaurants = [];
      this.categories = [];
      return;
    }

    this.loadingRestaurants = true;
    this.loadingCategories = true;

    this.restaurantService.findAll(0, searchText).subscribe(
      (result) => {
        this.restaurants = result;
      },
      null,
      () => {
        this.loadingRestaurants = false;
      }
    );

    this.categoryService.findSecondaries(searchText).subscribe(
      (result) => {
        const primaries =
          this.categoryService.filterPrimaryCategories(searchText);

        this.categories = primaries.concat(result);
      },
      null,
      () => {
        this.loadingCategories = false;
      }
    );
  }

  @HostListener('document:click', ['$event'])
  OnClick($event: any) {
    if (this.showSearchDropdown) {
      if (!$event.target.closest('#search-dropdown-group')) {
        this.showSearchDropdown = false;
      }
    }
  }
}
