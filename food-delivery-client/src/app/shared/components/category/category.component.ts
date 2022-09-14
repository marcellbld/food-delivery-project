import { Component, Input, OnInit } from '@angular/core';
import { CategoryI } from '../../models/category/category.interface';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() category: CategoryI | null = null;

  constructor() {}

  ngOnInit(): void {}
}
