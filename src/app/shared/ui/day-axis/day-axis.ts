import { Component, computed, input } from '@angular/core';

import { CLINICAL_MARGIN_MINUTES, dayDurationPercent, dayPositionPercent } from '../../../domain/day-window';
import { DoseBlock, findMarginConflicts } from '../../../domain/dose-block';
import { formatTimeOfDay, toMinutes } from '../../../domain/time-of-day';

const LABEL_HALF_WIDTH_PX = 75;

@Component({
  selector: 'at-day-axis',
  template: `
    <div class="overflow-x-auto" tabindex="0" role="group" [attr.aria-label]="label()">
      <div aria-hidden="true" class="relative h-46.5 min-w-160">
        <div class="absolute inset-x-0 top-23.25 h-0.5 rounded-[1px] bg-outline-variant"></div>
        @for (mark of marks(); track $index) {
          <span
            class="absolute top-19 h-9 rounded-[18px]"
            [class]="mark.conflict ? 'bg-error-container inset-ring-[1.5px] inset-ring-error' : 'bg-primary-container'"
            [style.left.%]="mark.bandLeft"
            [style.width.%]="bandWidth"
          ></span>
          <p
            class="absolute w-37.5 -translate-x-1/2 text-center text-title-small"
            [class]="mark.conflict ? 'text-error' : 'text-on-surface'"
            [style.top.px]="mark.below ? 128 : 14"
            [style.left]="mark.labelLeft"
          >
            {{ mark.label }}
          </p>
          <p
            class="absolute w-37.5 -translate-x-1/2 text-center text-label-medium text-on-surface-variant"
            [style.top.px]="mark.below ? 154 : 40"
            [style.left]="mark.labelLeft"
          >
            {{ mark.countLabel }}
          </p>
          <span
            class="absolute top-21.5 size-4 -translate-x-1/2 rounded-full"
            [class]="mark.conflict ? 'bg-error' : 'bg-primary'"
            [style.left.%]="mark.position"
          ></span>
        }
        <p class="absolute top-32 left-0 text-label-medium text-on-surface-variant">6 a. m.</p>
        <p class="absolute top-32 right-0 text-label-medium text-on-surface-variant">12 de la noche</p>
      </div>
      <ul class="sr-only">
        @for (mark of marks(); track $index) {
          <li>
            {{ mark.label }}, {{ mark.countLabel }}.
            @if (mark.conflict) {
              Está a menos de 30 minutos de otro bloque.
            }
          </li>
        }
      </ul>
    </div>
    <p class="pb-1 text-body-medium text-on-surface-variant">
      La banda alrededor de cada marca es el margen de 30 minutos, el mismo para todos los bloques.
    </p>
  `,
  host: {
    class: 'block',
  },
})
export class DayAxis {
  readonly blocks = input.required<readonly DoseBlock[]>();
  readonly label = input('El día completo con el margen de cada bloque');

  protected readonly bandWidth = dayDurationPercent(CLINICAL_MARGIN_MINUTES * 2);
  protected readonly marks = computed(() => {
    const blocks = this.blocks();
    const conflicts = findMarginConflicts(blocks);

    return blocks.map((block, index) => {
      const position = dayPositionPercent(block.time);
      const previous = blocks[index - 1];
      const conflict = conflicts.has(index);
      const closeToPrevious = !!previous && toMinutes(block.time) - toMinutes(previous.time) < CLINICAL_MARGIN_MINUTES;

      return {
        label: formatTimeOfDay(block.time),
        countLabel: `${block.medicationCount} ${block.medicationCount === 1 ? 'medicamento' : 'medicamentos'}`,
        position,
        bandLeft: position - this.bandWidth / 2,
        labelLeft: `clamp(${LABEL_HALF_WIDTH_PX}px, ${position}%, calc(100% - ${LABEL_HALF_WIDTH_PX}px))`,
        conflict,
        below: conflict && closeToPrevious,
      };
    });
  });
}
