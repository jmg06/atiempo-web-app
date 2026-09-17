import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export type NoticeKind = 'info' | 'attention' | 'result';

interface NoticeStyle {
  readonly container: string;
  readonly icon: string;
  readonly iconColor: string;
  readonly role: 'status' | 'alert' | null;
}

const NOTICE_STYLES: Record<NoticeKind, NoticeStyle> = {
  info: {
    container: 'bg-surface-container text-on-surface',
    icon: 'schedule',
    iconColor: 'text-on-surface-variant',
    role: null,
  },
  attention: {
    container: 'bg-state-pending-container text-on-state-pending-container inset-ring-2 inset-ring-state-pending',
    icon: 'warning',
    iconColor: 'text-state-pending',
    role: 'alert',
  },
  result: {
    container: 'bg-state-done-container text-on-state-done-container',
    icon: 'check_circle',
    iconColor: 'text-state-done',
    role: 'status',
  },
};

@Component({
  selector: 'at-notice-banner',
  imports: [MatIcon],
  template: `
    <mat-icon [class]="noticeStyle().iconColor">{{ icon() ?? noticeStyle().icon }}</mat-icon>
    <p class="min-w-0 flex-1 text-body-large"><ng-content /></p>
  `,
  host: {
    class: 'flex items-start gap-3 rounded-medium px-4 py-3.5',
    '[class]': 'noticeStyle().container',
    '[attr.role]': 'noticeStyle().role',
  },
})
export class NoticeBanner {
  readonly kind = input<NoticeKind>('info');
  readonly icon = input<string>();

  protected readonly noticeStyle = computed(() => NOTICE_STYLES[this.kind()]);
}
