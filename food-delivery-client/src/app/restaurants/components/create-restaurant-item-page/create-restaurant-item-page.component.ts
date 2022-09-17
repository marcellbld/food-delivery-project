import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { RestaurantItemService } from '../../../core/services/restaurant-item/restaurant-item.service';
import { RestaurantI } from '../../../shared/models/restaurant/restaurant.interface';
import { RestaurantItemI } from '../../../shared/models/restaurant-item/restaurant-item.interface';
import { getRestaurantItemImageUrl } from '../../../shared/utils/image-url-helper';
import { windowRef } from '../../../shared/utils/window-ref';

@Component({
  selector: 'app-create-restaurant-item-page',
  templateUrl: './create-restaurant-item-page.component.html',
  styleUrls: ['./create-restaurant-item-page.component.scss'],
})
export class CreateRestaurantItemPageComponent implements OnInit {
  form = new FormGroup({
    itemName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ],
    }),
    description: new FormControl('', [Validators.maxLength(50)]),
    price: new FormControl('', [Validators.required]),
    file: new FormControl(null),
  });

  apiProgress = false;
  createSuccess = false;

  uploadedImage: File | undefined;

  uploadedImageURL: string | undefined;

  restaurant: RestaurantI | undefined;

  editRestaurantItem: RestaurantItemI | undefined;

  window = windowRef();

  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly restaurantItemService: RestaurantItemService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    const restaurantId = this.route.snapshot.params['id'];
    this.restaurantService.findSelf().subscribe((result) => {
      const found = result.find((r) => r.id == restaurantId);
      this.restaurant = found;

      if (!this.restaurant) {
        router.navigate(['']);
      }
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit(): void {
    const state = this.window.history.state;
    const restaurantItem = state.restaurantItem;
    this.editRestaurantItem = restaurantItem;

    if (!this.editRestaurantItem && this.router.url.endsWith('/edit-item')) {
      this.router.navigate(['/']);
      return;
    }
    this.setupEditData();
  }

  setupEditData(): void {
    if (this.editRestaurantItem) {
      this.itemName?.setValue(this.editRestaurantItem.name);
      this.description?.setValue(this.editRestaurantItem.description);
      this.price?.setValue('' + this.editRestaurantItem.price);
      this.uploadedImageURL = getRestaurantItemImageUrl(
        this.editRestaurantItem.image
      );
    }
  }

  onClickSubmit(): void {
    if (!this.form.valid) return;

    if (this.editRestaurantItem) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.apiProgress = true;
    this.restaurantItemService
      .create({
        name: this.itemName?.value!,
        description: this.description?.value!,
        restaurant: this.restaurant?.id!,
        price: +this.price?.value!,
        file: this.uploadedImage,
      })
      .subscribe({
        next: () => {
          this.createSuccess = true;
          this.router.navigate([`/restaurants/${this.restaurant?.id}`]);
        },
        error: () => {
          this.apiProgress = false;
        },
      });
  }
  update(): void {
    this.apiProgress = true;
    this.restaurantItemService
      .update({
        id: +this.editRestaurantItem?.id!,
        name: this.itemName?.value!,
        description: this.description?.value!,
        restaurant: this.restaurant?.id!,
        price: +this.price?.value!,
        file: this.uploadedImage,
      })
      .subscribe({
        next: () => {
          this.createSuccess = true;
          this.router.navigate([`/restaurants/${this.restaurant?.id}`]);
        },
        error: () => {
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
    const formFilled = this.itemName?.value && this.price?.value;

    const validationError =
      this.itemNameError || this.descriptionError || this.priceError;

    return !formFilled || validationError !== undefined;
  }

  get itemName() {
    return this.form.get('itemName');
  }
  get description() {
    return this.form.get('description');
  }
  get price() {
    return this.form.get('price');
  }

  get file() {
    return this.form.get('file');
  }
  get itemNameError() {
    const field = this.itemName;
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) {
        return 'Name is required';
      } else if (field.errors['minlength'] || field.errors['maxlength']) {
        return 'Name must be between 3 and 30 characters long';
      }
    }
    return;
  }

  get descriptionError() {
    const field = this.description;
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['maxlength'])
        return 'Description must be maximum 50 characters long';
    }
    return;
  }

  get priceError() {
    const field = this.price;
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) {
        return 'Price is required';
      }
    }
    return;
  }

  get title(): string {
    return this.editRestaurantItem ? 'Edit item' : 'Create item';
  }
  get buttonText(): string {
    return this.editRestaurantItem ? 'Edit' : 'Create';
  }
}
