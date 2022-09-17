import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryI } from '../../../shared/models/category/category.interface';
import { CategoryService } from '../../../core/services/category/category.service';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { RestaurantNameTakenValidator } from '../../validators/restaurant-name-taken.validator';
import { AuthService } from '../../../core/services/auth/auth.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { getRestaurantImageUrl } from '../../../shared/utils/image-url-helper';
import { windowRef } from '../../../shared/utils/window-ref';

@Component({
  selector: 'app-create-restaurant-page',
  templateUrl: './create-restaurant-page.component.html',
  styleUrls: ['./create-restaurant-page.component.scss'],
})
export class CreateRestaurantPageComponent implements OnInit {
  subscriptions = new Array<Subscription>();
  categoriesTypeahead = new EventEmitter<string>();

  form = new FormGroup({
    restaurantName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ],
      asyncValidators: [
        this.restaurantNameTakenValidator.validate.bind(
          this.restaurantNameTakenValidator
        ),
      ],
      updateOn: 'blur',
    }),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(300),
    ]),
    categories: new FormControl([]),
    file: new FormControl(null),
  });

  apiProgress = false;
  createSuccess = false;

  categoryList: CategoryI[] = [];

  uploadedImage: File | undefined;

  uploadedImageURL: string | undefined;

  editRestaurant: RestaurantI | undefined;

  window = windowRef();

  constructor(
    private readonly authService: AuthService,
    private readonly categoryService: CategoryService,
    private readonly restaurantService: RestaurantService,
    private readonly restaurantNameTakenValidator: RestaurantNameTakenValidator,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.findPrimaries().subscribe((result) => {
      this.categoryList = result;
    });

    this.subscriptions.push(
      this.categoriesTypeahead
        .pipe(distinctUntilChanged(), debounceTime(200))
        .subscribe((term) => {
          this.categorySearch(term);
        })
    );

    const state = this.window.history.state;
    const restaurant = state.restaurant;
    this.editRestaurant = restaurant;

    if (!this.editRestaurant && this.router.url.endsWith('/edit')) {
      this.router.navigate(['/']);
      return;
    }

    if (this.editRestaurant) {
      this.restaurantName?.clearAsyncValidators();
      this.restaurantName?.clearValidators();
      this.restaurantName?.updateValueAndValidity();

      this.setupEditData();
    }
  }

  setupEditData(): void {
    if (this.editRestaurant) {
      this.restaurantName?.setValue(this.editRestaurant.name);
      this.description?.setValue(this.editRestaurant.description);
      this.uploadedImageURL = getRestaurantImageUrl(this.editRestaurant.image);

      this.categoryList.push(...this.editRestaurant.categories);
      this.categories?.setValue(
        this.editRestaurant.categories.map((c) => c.id) as never[]
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  onClickSubmit(): void {
    console.log(this.form.valid);

    if (!this.form.valid) return;

    if (this.editRestaurant) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.apiProgress = true;
    this.restaurantService
      .create({
        name: this.restaurantName?.value!,
        description: this.description?.value!,
        owner: this.authService.loggedInUser()?.id || -1,
        categories: this.categories?.value as number[],
        file: this.uploadedImage,
      })
      .subscribe({
        next: (restaurant: RestaurantI) => {
          this.createSuccess = true;
          this.router.navigate([`restaurants/${restaurant.id}`]);
        },
        error: () => {
          this.apiProgress = false;
        },
      });
  }

  update(): void {
    this.apiProgress = true;
    this.restaurantService
      .update({
        id: '' + this.editRestaurant!.id,
        description: this.description?.value!,
        categories: this.categories?.value as number[],
        file: this.uploadedImage,
      })
      .subscribe({
        next: (restaurant: RestaurantI) => {
          this.createSuccess = true;
          this.router.navigate([`restaurants/${restaurant.id}`]);
        },
        error: (err: any) => {
          this.apiProgress = false;
        },
      });
  }

  onUploadedImageChange($event: any) {
    const file = $event.srcElement.files[0];

    this.uploadedImage = file;

    if (!file) {
      this.uploadedImageURL = undefined;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  isDisabled() {
    const formFilled = this.restaurantName?.value && this.description?.value;

    const validationError = this.restaurantNameError || this.descriptionError;

    return !formFilled || validationError !== undefined;
  }

  get restaurantName() {
    return this.form.get('restaurantName');
  }
  get description() {
    return this.form.get('description');
  }

  get categories() {
    return this.form.get('categories');
  }

  get file() {
    return this.form.get('file');
  }
  get restaurantNameError() {
    const field = this.restaurantName;
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) {
        return 'Name is required';
      } else if (field.errors['minlength'] || field.errors['maxlength']) {
        return 'Name must be between 5 and 30 characters long';
      } else if (field.errors['restaurantNameTaken']) {
        return 'Name is already taken.';
      }
    }
    return;
  }

  get descriptionError() {
    const field = this.description;
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) {
        return 'Description is required';
      } else if (field.errors['minlength'] || field.errors['maxlength'])
        return 'Description must be between 20 and 300 characters long';
    }
    return;
  }

  categorySearch(nameFilter: string) {
    if (nameFilter === '') {
      this.categoryList = this.categoryService.primaryCategories;
    } else {
      this.categoryService.findSecondaries(nameFilter).subscribe((result) => {
        const primaries =
          this.categoryService.filterPrimaryCategories(nameFilter);

        this.categoryList = primaries.concat(result);
      });
    }
  }

  get title(): string {
    return this.editRestaurant ? 'Edit restaurant' : 'Create restaurant';
  }
  get buttonText(): string {
    return this.editRestaurant ? 'Edit' : 'Create';
  }
}
