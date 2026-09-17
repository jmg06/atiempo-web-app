import { Component, ViewEncapsulation, input, model, output, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';

export interface SelectOption<T> {
  readonly value: T;
  readonly label: string;
}

@Component({
  selector: 'at-select-field',
  imports: [MatFormField, MatLabel, MatSuffix, MatIcon, MatSelect, MatOption],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label>{{ label() }}</mat-label>
      <mat-select
        panelClass="at-select-panel"
        hideSingleSelectionIndicator
        [value]="value()"
        [disabled]="disabled()"
        (valueChange)="value.set($event)"
        (openedChange)="onOpenedChange($event)"
      >
        @for (option of options(); track option.value) {
          <mat-option [value]="option.value">{{ option.label }}</mat-option>
        }
      </mat-select>
      <mat-icon matSuffix class="at-select-field__arrow">expand_more</mat-icon>
    </mat-form-field>
  `,
  styleUrl: './select-field.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class SelectField<T> implements FormValueControl<T | undefined> {
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly value = model<T>();
  readonly disabled = input(false);
  readonly touch = output<void>();

  private readonly select = viewChild.required(MatSelect);

  focus(options?: FocusOptions): void {
    this.select().focus(options);
  }

  protected onOpenedChange(opened: boolean): void {
    if (!opened) {
      this.touch.emit();
    }
  }
}
