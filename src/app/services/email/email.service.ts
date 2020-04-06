import { EmailModel, EmailService } from './email.service.api';
import { Subscription } from '../common-api';

export class EmailServiceImplementation extends EmailService {
    private subscriptions: Subscription[] = [];
    private emails: EmailModel[] = [];
    private baseEmailsId: number = 0;

    constructor() {
        super();
    }

    addEmail(email: string, callback?: (model: EmailModel)  => void): void {
        const id: string = `${this.baseEmailsId++}`;
        this.emails.push({
            email,
            id
        });

        if (callback) {
            callback({
                id,
                email
            });
        }
        this.notifySubscribers();
    }

    update(newEmail: EmailModel): void {
        const [updatedEmail]: EmailModel[] = this
            .emails
            .filter(({id}: EmailModel) => id === newEmail.id);

        updatedEmail.email = newEmail.email;
        this.notifySubscribers();
    }

    getEmailCount(): number {
        return this.emails.length;
    }

    getEnteredEmails(): string[] {
        return this.emails.map(({email}: EmailModel) => email);
    }

    getEmails(): EmailModel[] {
        return this.emails;
    }

    setEmails(callback: () => void, emails: string[]): void {
        this.emails = emails
            .map((email: string) => ({
                email,
                id: `${this.baseEmailsId++}`
            }));
        callback();
        this.notifySubscribers();
    }

    remove(emailId: string): void {
        this.emails = this
            .emails
            .filter((email: EmailModel) => email.id !== emailId);
        this.notifySubscribers();
    }

    removeLast(): void {
        this.emails.pop();
        this.notifySubscribers();
    }

    addRandomEmail(callback: (model: EmailModel) => void): void {
        this.addEmail(`${Math.round(Math.random() * 1000)}@test.com`, callback);
    }

    subscribeOnChanges(callback: (emails: string[]) => void): Subscription {
        const newSubscription: Subscription = new Subscription(this.subscriptions, callback);
        this.subscriptions.push(newSubscription);
        return newSubscription;
    }

    private notifySubscribers(): void {
        const emails: string[] = this
            .emails
            .map((model: EmailModel) => model.email);

        this
            .subscriptions
            .forEach((subscription: Subscription) => subscription.callback(emails));
    }
}