import { EmailService } from './email.service.api';
import { HttpService } from '../http/http.service.api';

export class EmailServiceImplementation extends EmailService {
    private emails: string[] = ['jegius@gmial.com', 'test@test.com', 'invalid.email'];

    constructor(
        private readonly httpService: HttpService
    ) {
        super();
    }

    addEmail(email: string): void {
        this.emails.push(email);
    }

    edit(oldEmail: string, newValue: string): void {
        const index: number = this
            .emails
            .findIndex((email: string) => email === oldEmail);
        this.emails.splice(index, 1, newValue);
    }

    getEmailCount(): number {
        return this.emails.length;
    }

    getEmails(): string[] {
        return this.emails;
    }

    remove(email: string): void {
        const index: number = this
            .emails
            .findIndex((email: string) => email === email);
        this.emails.splice(index, 1);
    }
}