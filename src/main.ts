import 'main.less';
import { EmailInputComponent } from './app/email-input.component';
import { ComponentApi, Subscription } from './app/services/common-api';

const HOST_CLASS: string = '.host__container';
const host: HTMLElement = window.document.querySelector(HOST_CLASS);

const emailApi: ComponentApi = new EmailInputComponent(host).render();


const emailSubscription: Subscription = emailApi
    .subscribeOnChanges((emails: string[]) => console.log(emails));

emailApi.setEmails(['123@sfdf.com', '13323@sfdf.com']);
console.log(`Entered emails: ${emailApi.getEnteredEmails()}`);

emailSubscription.unsubscribe();