import { Component, ViewEncapsulation, input, model } from '@angular/core';
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
export class SelectField<T> {
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly value = model<T>();
  readonly disabled = input(false);
}
