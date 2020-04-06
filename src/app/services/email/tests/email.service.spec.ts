import { EmailModel, EmailService } from '../email.service.api';
import { EmailServiceImplementation } from '../email.service';
import { Subscription } from '../../common-api';

describe('EmailService', () => {
    let emailService: EmailService;

    beforeEach(() => {
        emailService = new EmailServiceImplementation();
    });

    it('should be created.', () => {
        expect(emailService).toBeTruthy();
    });

    it('subscribeOnChanges: should make subscription on email changes', () => {
        const expectedResult: string = 'test@test.com';
        const addEmailCallback: (emails: string[]) => void = jasmine.createSpy();
        emailService.subscribeOnChanges(addEmailCallback);
        emailService.addEmail(expectedResult);

        expect(addEmailCallback).toHaveBeenCalledWith([expectedResult]);
    });

    it('subscribeOnChanges: should have opportunity for unsubscribe from email changes ', () => {
        const expectedResult: string = 'test@test.com';
        const addEmailCallback: (emails: string[]) => void = jasmine.createSpy();
        const subscription: Subscription = emailService.subscribeOnChanges(addEmailCallback);
        emailService.addEmail(expectedResult);

        expect(addEmailCallback).toHaveBeenCalledWith([expectedResult]);
        (addEmailCallback as jasmine.Spy).calls.reset();

        subscription.unsubscribe();

        emailService.addEmail(expectedResult);

        expect(addEmailCallback).not.toHaveBeenCalled();
    });

    it('addEmail: should add email to service.', () => {
        const expectedResult: string = 'test';
        emailService.addEmail(expectedResult);
        const [{email}] = emailService.getEmails();

        expect(email).toEqual(expectedResult);
    });

    it('addEmail: should add email to service and call provided callback.', () => {
        const expectedResult: string = 'test';
        const addEmailCallback: (model: EmailModel) => void = jasmine.createSpy();

        emailService.addEmail(expectedResult, addEmailCallback);
        const [{email}] = emailService.getEmails();

        expect(email).toEqual(expectedResult);
        expect(addEmailCallback).toHaveBeenCalled();
    });

    it('addEmail: should notify subscribers after email changes.', () => {
        const expectedResult: string = 'test@test.com';
        const addEmailCallback: (emails: string[]) => void = jasmine.createSpy();
        emailService.subscribeOnChanges(addEmailCallback);
        emailService.addEmail(expectedResult);

        expect(addEmailCallback).toHaveBeenCalledWith([expectedResult]);
    });

    it('addRandomEmail: should add random email.', () => {
        const addEmailCallback: (emails: EmailModel) => void = jasmine.createSpy();
        emailService.addRandomEmail(addEmailCallback);
        const newEmail: number = emailService.getEmails().length;
        const expectedEmailQuantity: number = 1;

        expect(newEmail).toEqual(expectedEmailQuantity);
        expect(addEmailCallback).toHaveBeenCalled();
    });

    it('addRandomEmail: should add random email according method call.', () => {
        const addEmailCallback: (emails: EmailModel) => void = jasmine.createSpy();
        emailService.addRandomEmail(addEmailCallback);
        emailService.addRandomEmail(addEmailCallback);
        emailService.addRandomEmail(addEmailCallback);
        emailService.addRandomEmail(addEmailCallback);
        emailService.addRandomEmail(addEmailCallback);
        const newEmail: number = emailService.getEmails().length;
        const expectedEmailQuantity: number = 5;

        expect(newEmail).toEqual(expectedEmailQuantity);
    });

    it('addRandomEmail: should notify subscribers after email changes.', () => {
        const addEmailCallback: (emails: string[]) => void = jasmine.createSpy();
        const callback: (emails: EmailModel) => void = jasmine.createSpy();
        const expectedEmailQuantity: number = 1;

        emailService.subscribeOnChanges(addEmailCallback);
        emailService.addRandomEmail(callback);

        const newEmail: number = emailService.getEmails().length;
        expect(newEmail).toEqual(expectedEmailQuantity);
        expect(addEmailCallback).toHaveBeenCalled();
    });

    it('removeLast: should remove last email from service.', () => {

        emailService.addEmail('first');
        emailService.addEmail('second');
        emailService.addEmail('last');
        emailService.removeLast();
        const result: string[] = emailService.getEmails().map((model: EmailModel) => model.email);

        expect(result).toEqual(['first', 'second']);
    });

    it('addRandomEmail: should notify subscribers after email changes.', () => {
        const subscriptionCallback: (emails: string[]) => void = jasmine.createSpy();

        emailService.subscribeOnChanges(subscriptionCallback);
        emailService.addEmail('first');
        emailService.removeLast();

        expect(subscriptionCallback).toHaveBeenCalled();
    });

    it('remove: should remove model from service by provided id.', () => {
        emailService.addEmail('first');
        const [addedEmail]: EmailModel[] = emailService.getEmails();
        emailService.remove(addedEmail.id);

        expect(emailService.getEmails().length).toEqual(0);
    });

    it('remove: should notify subscribers about email changes.', () => {
        const subscriptionCallback: (emails: string[]) => void = jasmine.createSpy();
        emailService.subscribeOnChanges(subscriptionCallback);
        emailService.addEmail('first');
        const [addedEmail]: EmailModel[] = emailService.getEmails();
        emailService.remove(addedEmail.id);

        expect(subscriptionCallback).toHaveBeenCalled();
    });

    it('setEmails: should add provided email to service.', () => {
        const callback: () => void = jasmine.createSpy();
        const expectedResult: string[] = ['first', 'second'];
        emailService.setEmails(callback, ['first', 'second']);
        const emails: string[] = emailService.getEmails().map(({email}: EmailModel) => email);

        expect(emails).toEqual(expectedResult);
    });

    it('setEmails: should notify subscribers about changes.', () => {
        const subscriptionCallback: (emails: string[]) => void = jasmine.createSpy();
        emailService.subscribeOnChanges(subscriptionCallback);
        const callback: () => void = jasmine.createSpy();
        emailService.setEmails(callback, ['first', 'second']);

        expect(subscriptionCallback).toHaveBeenCalled();
    });

    it('getEmails: should return email models from service.', () => {
        emailService.addEmail('1');
        emailService.addEmail('2');
        emailService.addEmail('3');
        emailService.addEmail('4');

        const result: string[] = emailService.getEmails().map(({email}: EmailModel) => email);

        expect(result).toEqual(['1', '2', '3', '4']);
    });

    it('getEnteredEmails: should return email models from service.', () => {
        emailService.addEmail('1');
        emailService.addEmail('2');
        emailService.addEmail('3');
        emailService.addEmail('4');

        const result: string[] = emailService.getEnteredEmails();

        expect(result).toEqual(['1', '2', '3', '4']);
    });

    it('getEmailCount: should return emails quantity.', () => {
        emailService.addEmail('1');
        emailService.addEmail('2');
        emailService.addEmail('3');
        emailService.addEmail('4');

        const result: number = emailService.getEmailCount();

        expect(result).toEqual(4);
    });

    it('update: should update email by id.', () => {
        const expectedEmail: string = 'test@test.com';
        emailService.addEmail('1');
        const [createdModel] = emailService.getEmails();

        createdModel.email = expectedEmail;
        emailService.update(createdModel);
        const [expectedResult] = emailService.getEmails();

        expect(expectedResult.email).toEqual(expectedEmail);
    });

    it('update: should notify subscribers about changes.', () => {
        const subscriptionCallback: (emails: string[]) => void = jasmine.createSpy();
        emailService.subscribeOnChanges(subscriptionCallback);
        const expectedEmail: string = 'test@test.com';
        emailService.addEmail('1');
        const [createdModel] = emailService.getEmails();

        createdModel.email = expectedEmail;
        emailService.update(createdModel);

        expect(subscriptionCallback).toHaveBeenCalled();
    });
});