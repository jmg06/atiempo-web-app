import { Service, computed, signal } from '@angular/core';

import { Account, SIGN_IN_ATTEMPT_LIMIT, isSameEmail } from '../domain/account';
import { MOCK_ACCOUNT } from './mock-account';
import { simulateLatency } from './simulated-latency';

@Service()
export class AccountStore {
  private readonly account = signal<Account>(MOCK_ACCOUNT);
  private readonly failedSignIns = signal(0);

  readonly remainingAttempts = computed(() => Math.max(0, SIGN_IN_ATTEMPT_LIMIT - this.failedSignIns()));
  readonly locked = computed(() => this.remainingAttempts() === 0);

  async createAccount(email: string, password: string): Promise<boolean> {
    await simulateLatency();

    if (isSameEmail(email, this.account().email)) {
      return false;
    }

    this.account.set({ email, password });

    return true;
  }

  async signIn(email: string, password: string): Promise<boolean> {
    await simulateLatency();

    const account = this.account();
    const matches = isSameEmail(email, account.email) && password === account.password;

    if (!matches) {
      this.failedSignIns.update((count) => count + 1);
    }

    return matches;
  }

  async sendRecoveryLink(): Promise<void> {
    await simulateLatency();
  }
}
