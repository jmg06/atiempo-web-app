import { NgOptimizedImage } from '@angular/common';
import { Component, ViewEncapsulation, computed, effect, input, model, viewChild } from '@angular/core';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export type TextFieldType = 'text' | 'email' | 'password' | 'tel';

@Component({
  selector: 'at-text-field',
  imports: [NgOptimizedImage, MatFormField, MatLabel, MatInput, MatHint, MatError, MatSuffix],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label>{{ label() }}</mat-label>
      <input
        matInput
        [type]="type()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.autocomplete]="autocomplete()"
        [attr.inputmode]="inputMode()"
        (input)="onInput($event)"
      />
      @if (errorText()) {
        <span matSuffix class="at-text-field__error-icon">
          <img ngSrc="icons/field-error.svg" width="24" height="24" alt="" />
        </span>
      }
      @if (errorText()) {
        <mat-error>{{ errorText() }}</mat-error>
      } @else if (supportingText()) {
        <mat-hint>{{ supportingText() }}</mat-hint>
      }
    </mat-form-field>
  `,
  styleUrl: './text-field.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
    '[class.min-h-20]': 'hasSubscript()',
  },
})
export class TextField {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly supportingText = input<string>();
  readonly errorText = input<string>();
  readonly type = input<TextFieldType>('text');
  readonly autocomplete = input<string>();
  readonly inputMode = input<string>();
  readonly disabled = input(false);

  protected readonly hasSubscript = computed(() => !!(this.errorText() || this.supportingText()));

  private readonly matInput = viewChild.required(MatInput);

  constructor() {
    effect(() => {
      const matInput = this.matInput();
      matInput.errorState = !!this.errorText();
      matInput.stateChanges.next();
    });
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
