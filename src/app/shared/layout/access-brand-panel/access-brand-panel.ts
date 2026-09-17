import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { BrandMark } from '../../ui/brand-mark/brand-mark';

export type AccessStep = 1 | 2 | 3 | null;

type StepState = 'done' | 'current' | 'pending';

const FUNNEL_STEPS = ['Crea tu cuenta', 'Tus datos de salud', 'Crea tu hogar'] as const;

const PROMISES = [
  { icon: 'alarm', text: 'Cargas los bloques una vez y los dos teléfonos se enteran' },
  { icon: 'medication', text: 'Aceptas varios medicamentos por bloque, media tableta y líquidos' },
  { icon: 'person', text: 'Invitas a la otra persona que administra las dosis' },
] as const;

@Component({
  selector: 'at-access-brand-panel',
  imports: [NgOptimizedImage, MatIcon, BrandMark],
  template: `
    <span
      aria-hidden="true"
      class="pointer-events-none absolute top-[-170px] left-[340px] size-[460px] rounded-full bg-on-primary/7"
    ></span>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute top-[739px] left-[-137px] hidden size-[400px] rounded-full bg-on-primary/7 lg:block"
    ></span>

    <div class="relative flex flex-col gap-2.5">
      <at-brand-mark [size]="44" />
      <p class="text-headline-large text-on-primary">a tiempo</p>
      <p class="text-label-medium text-primary-container">Alarmas de medicamentos</p>
    </div>

    @if (step() === null) {
      <ul class="relative flex flex-col gap-6">
        @for (promise of promises; track promise.icon) {
          <li class="flex items-start gap-4">
            <mat-icon class="text-primary-container">{{ promise.icon }}</mat-icon>
            <span class="min-w-0 flex-1 text-body-large text-on-primary">{{ promise.text }}</span>
          </li>
        }
      </ul>
    } @else {
      <div class="relative flex flex-col gap-1">
        <p id="access-steps-heading" class="text-label-medium text-primary-container">TRES PASOS Y QUEDA LISTO</p>
        <ol aria-labelledby="access-steps-heading" class="flex flex-col gap-1">
          @for (funnelStep of steps(); track funnelStep.number) {
            <li
              class="flex items-center gap-4 py-2.5 text-on-primary"
              [attr.aria-current]="funnelStep.state === 'current' ? 'step' : null"
            >
              @switch (funnelStep.state) {
                @case ('done') {
                  <span class="flex size-8 shrink-0 items-center justify-center">
                    <mat-icon class="text-primary-container">check_circle</mat-icon>
                  </span>
                  <span class="min-w-0 flex-1 text-body-large">
                    <span class="sr-only">Hecho:</span>
                    {{ funnelStep.label }}
                  </span>
                }
                @case ('current') {
                  <span
                    aria-hidden="true"
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-on-primary text-title-small text-brand-teal-dark"
                  >
                    {{ funnelStep.number }}
                  </span>
                  <span class="min-w-0 flex-1 text-title-medium">{{ funnelStep.label }}</span>
                }
                @case ('pending') {
                  <span
                    aria-hidden="true"
                    class="flex size-8 shrink-0 items-center justify-center rounded-full text-title-small inset-ring-[1.5px] inset-ring-on-primary"
                  >
                    {{ funnelStep.number }}
                  </span>
                  <span class="min-w-0 flex-1 text-body-large">{{ funnelStep.label }}</span>
                }
              }
            </li>
          }
        </ol>
      </div>
    }

    <img
      class="relative hidden lg:block"
      ngSrc="illustrations/alarm-clock.svg"
      width="200"
      height="233"
      alt=""
      priority
    />
  `,
  host: {
    class:
      'relative flex flex-col gap-8 overflow-hidden bg-access-gradient px-4 py-8 md:px-8 lg:justify-between lg:gap-0 lg:px-24 lg:py-16',
  },
})
export class AccessBrandPanel {
  readonly step = input<AccessStep>(null);

  protected readonly promises = PROMISES;
  protected readonly steps = computed(() => {
    const current = this.step() ?? 0;

    return FUNNEL_STEPS.map((label, index) => {
      const number = index + 1;
      const state: StepState = number < current ? 'done' : number === current ? 'current' : 'pending';

      return { number, label, state };
    });
  });
}
