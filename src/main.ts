import 'main.less';
import { EmailInputComponent } from './app/email-input.component';
import { ComponentApi, Subscription } from './app/services/common-api';

const HOST_CLASS: string = '.host__container';
const host: HTMLElement = window.document.querySelector(HOST_CLASS);

const createEmailApi: ComponentApi = new EmailInputComponent(host).render();
const emailSubscription: Subscription = createEmailApi
    .subscribeOnChanges((emails: string[]) => console.log(emails));

createEmailApi.setEmails(['123@sfdf.com', '13323@sfdf.com']);
console.log(`Entered emails: ${createEmailApi.getEnteredEmails()}`);

emailSubscription.unsubscribe();