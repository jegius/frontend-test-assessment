export abstract class EmailService {

    abstract getEmails(): string[];

    abstract addEmail(email: string): void;

    abstract remove(email: string): void;

    abstract getEmailCount(): number;

    abstract edit(oldEmail: string, newValue: string): void;
}