import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  flush,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export enum KeyCode {
  Tab = 9,
  Enter = 13,
  Esc = 27,
  Space = 32,
  ArrowUp = 38,
  ArrowDown = 40,
  Backspace = 8,
}
export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  tick();
  discardPeriodicTasks();
}

export function selectOption(
  fixture: ComponentFixture<any>,
  key: KeyCode,
  index: number
) {
  triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
  tickAndDetectChanges(fixture);
  for (let i = 0; i < index; i++) {
    triggerKeyDownEvent(getNgSelectElement(fixture), key);
  }
  triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
}

export function getNgSelectElement(
  fixture: ComponentFixture<any>
): DebugElement {
  return fixture.debugElement.query(By.css('ng-select'));
}

export function triggerKeyDownEvent(
  element: DebugElement,
  which: number,
  key = ''
): void {
  element.triggerEventHandler('keydown', {
    which,
    key,
    preventDefault: () => {},
  });
}
