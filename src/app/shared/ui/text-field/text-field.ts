import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
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
        #input
        matInput
        [type]="type()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.autocomplete]="autocomplete()"
        [attr.inputmode]="inputMode()"
        (input)="onInput($event)"
        (blur)="touch.emit()"
      />
      @if (shownError()) {
        <span matSuffix class="at-text-field__error-icon">
          <img ngSrc="icons/field-error.svg" width="24" height="24" alt="" />
        </span>
      }
      @if (shownError()) {
        <mat-error>{{ shownError() }}</mat-error>
      } @else if (supportingText()) {
        <mat-hint>{{ supportingText() }}</mat-hint>
      }
    </mat-form-field>
  `,
  styleUrl: './text-field.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
    '[class.h-20]': 'hasSubscript()',
  },
})
export class TextField implements FormValueControl<string> {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly supportingText = input<string>();
  readonly errorText = input<string>();
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touched = input(false);
  readonly type = input<TextFieldType>('text');
  readonly autocomplete = input<string>();
  readonly inputMode = input<string>();
  readonly disabled = input(false);
  readonly touch = output<void>();

  protected readonly shownError = computed(() => {
    const errorText = this.errorText();

    if (errorText) {
      return errorText;
    }

    return this.touched() ? this.errors()[0]?.message : undefined;
  });
  protected readonly hasSubscript = computed(() => !!this.shownError() || !!this.supportingText());

  private readonly matInput = viewChild.required(MatInput);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');

  constructor() {
    effect(() => {
      const matInput = this.matInput();
      matInput.errorState = !!this.shownError();
      matInput.stateChanges.next();
    });
  }

  focus(options?: FocusOptions): void {
    this.inputElement().nativeElement.focus(options);
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
