import { Service, computed, signal } from '@angular/core';

import { ScheduleBlock, sortBlocks } from '../domain/schedule-block';
import { ScheduleChange, describeScheduleChange } from '../domain/schedule-change';
import { reviewSchedule } from '../domain/schedule-review';
import { MOCK_LAST_PUBLISHED_ON, MOCK_PUBLISHED_BLOCKS, MOCK_TREATMENT } from './mock-schedule';
import { simulateLatency } from './simulated-latency';

export interface ScheduleDraft {
  readonly block: ScheduleBlock;
  readonly isNew: boolean;
}

const NEW_BLOCK_ID = 'nuevo';

@Service()
export class ScheduleStore {
  readonly treatment = MOCK_TREATMENT;
  readonly lastPublishedOn = MOCK_LAST_PUBLISHED_ON;

  private readonly published = signal<readonly ScheduleBlock[]>(sortBlocks(MOCK_PUBLISHED_BLOCKS));
  private readonly publishedTodayState = signal(false);
  private readonly draftState = signal<ScheduleDraft | null>(null);
  private readonly publicationNoticeState = signal(false);

  readonly publishedBlocks = this.published.asReadonly();
  readonly publishedToday = this.publishedTodayState.asReadonly();
  readonly draft = this.draftState.asReadonly();
  readonly publicationNotice = this.publicationNoticeState.asReadonly();

  readonly reviewedBlocks = computed(() => this.applyDraft(this.published(), this.draftState()));
  readonly review = computed(() =>
    reviewSchedule(this.reviewedBlocks(), this.treatment, this.draftState()?.block.id ?? null)
  );
  readonly change = computed<ScheduleChange>(() => {
    const draft = this.draftState();

    if (!draft) {
      return { kind: 'none' };
    }

    return describeScheduleChange(draft.isNew ? null : (this.findPublishedBlock(draft.block.id) ?? null), draft.block);
  });

  findPublishedBlock(blockId: string): ScheduleBlock | undefined {
    return this.published().find(({ id }) => id === blockId);
  }

  draftFor(blockId: string | null): ScheduleDraft | null {
    const draft = this.draftState();
    const matches = blockId === null ? draft?.isNew : !draft?.isNew && draft?.block.id === blockId;

    return matches && draft ? draft : null;
  }

  async saveDraft(block: Omit<ScheduleBlock, 'id'>, blockId: string | null): Promise<void> {
    await simulateLatency();
    this.draftState.set({ block: { ...block, id: blockId ?? NEW_BLOCK_ID }, isNew: blockId === null });
  }

  discardDraft(): void {
    this.draftState.set(null);
  }

  async publish(): Promise<void> {
    await simulateLatency();

    const nextId = String(Math.max(0, ...this.published().map(({ id }) => Number(id) || 0)) + 1);

    this.published.set(
      this.reviewedBlocks().map((block) => (block.id === NEW_BLOCK_ID ? { ...block, id: nextId } : block))
    );
    this.draftState.set(null);
    this.publishedTodayState.set(true);
    this.publicationNoticeState.set(true);
  }

  dismissPublicationNotice(): void {
    this.publicationNoticeState.set(false);
  }

  private applyDraft(published: readonly ScheduleBlock[], draft: ScheduleDraft | null): readonly ScheduleBlock[] {
    if (!draft) {
      return published;
    }

    return sortBlocks(
      draft.isNew
        ? [...published, draft.block]
        : published.map((block) => (block.id === draft.block.id ? draft.block : block))
    );
  }
}
