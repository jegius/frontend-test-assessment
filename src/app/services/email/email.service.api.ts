import { Subscription } from '../common-api';

export interface EmailModel {
    id: string;
    email: string;
}

export abstract class EmailService {

    abstract getEmails(): EmailModel[];

    abstract getEnteredEmails(): string[];

    abstract setEmails(callback: () => void, emails: string[]): void;

    abstract addEmail(email: string, callback?: (model: EmailModel) => void): void;

    abstract removeLast(): void;

    abstract remove(emailId: string): void;

    abstract getEmailCount(): number;

    abstract update(newEmail: EmailModel): void;

    abstract addRandomEmail(callback: (model: EmailModel) => void): void;

    abstract subscribeOnChanges(callback: (emails: string[]) => void): Subscription;
}