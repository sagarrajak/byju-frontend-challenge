import { Subscription } from 'rxjs';

export class Helper {
    protected subscriptions: Subscription[] = [];

    public clearMemory(): void {
        this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
        this.subscriptions = [];
    }
}