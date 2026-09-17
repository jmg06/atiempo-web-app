import { Component, computed, input } from '@angular/core';

import { dayPositionPercent } from '../../../domain/day-window';
import { TimeOfDay, formatTimeOfDay } from '../../../domain/time-of-day';

export type DayTimelineFormat = 'with-times' | 'compact';

interface TimelineGeometry {
  readonly height: number;
  readonly axisTop: number;
  readonly markerTop: number;
  readonly edgeLabelTop: number;
  readonly edgeLabelOverhang: number;
}

const GEOMETRY: Record<DayTimelineFormat, TimelineGeometry> = {
  'with-times': { height: 92, axisTop: 51, markerTop: 44, edgeLabelTop: 72, edgeLabelOverhang: 0 },
  compact: { height: 44, axisTop: 11, markerTop: 4, edgeLabelTop: 32, edgeLabelOverhang: 4 },
};

const LABEL_HALF_WIDTH_PX = 75;

@Component({
  selector: 'at-day-timeline',
  template: `
    <div
      class="overflow-x-auto"
      tabindex="0"
      role="group"
      [attr.aria-label]="label()"
      [style.padding-bottom.px]="geometry().edgeLabelOverhang"
      [style.margin-bottom.px]="-geometry().edgeLabelOverhang"
    >
      <div aria-hidden="true" class="relative min-w-160" [style.height.px]="geometry().height">
        <div
          class="absolute inset-x-0 h-0.5 rounded-[1px] bg-outline-variant"
          [style.top.px]="geometry().axisTop"
        ></div>
        @for (mark of marks(); track $index) {
          @if (format() === 'with-times') {
            <p
              class="absolute top-4 w-37.5 -translate-x-1/2 text-center text-title-small text-on-surface"
              [style.left]="mark.labelLeft"
            >
              {{ mark.label }}
            </p>
          }
          <span
            class="absolute size-4 -translate-x-1/2 rounded-full bg-primary"
            [style.top.px]="geometry().markerTop"
            [style.left.%]="mark.position"
          ></span>
        }
        <p class="absolute left-0 text-label-medium text-on-surface-variant" [style.top.px]="geometry().edgeLabelTop">
          6 a. m.
        </p>
        <p class="absolute right-0 text-label-medium text-on-surface-variant" [style.top.px]="geometry().edgeLabelTop">
          12 de la noche
        </p>
      </div>
      <ol class="sr-only">
        @for (mark of marks(); track $index) {
          <li>{{ mark.label }}</li>
        }
      </ol>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class DayTimeline {
  readonly blocks = input.required<readonly TimeOfDay[]>();
  readonly format = input<DayTimelineFormat>('with-times');
  readonly label = input('Los bloques sobre el día');

  protected readonly geometry = computed(() => GEOMETRY[this.format()]);
  protected readonly marks = computed(() =>
    this.blocks().map((time) => {
      const position = dayPositionPercent(time);

      return {
        label: formatTimeOfDay(time),
        position,
        labelLeft: `clamp(${LABEL_HALF_WIDTH_PX}px, ${position}%, calc(100% - ${LABEL_HALF_WIDTH_PX}px))`,
      };
    })
  );
}
