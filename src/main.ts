import 'main.less';
import { EmailInputComponent } from './app/email-input.component';
import { LocalizationService } from './app/services/localization/localization.service.api';
import { LocalizationServiceImplementation } from './app/services/localization/localization.service';
import { HttpService } from './app/services/http/http.service.api';
import { HttpServiceImplementation } from './app/services/http/http.service';
import { EmailService } from './app/services/email/email.service.api';
import { EmailServiceImplementation } from './app/services/email/email.service';

const HOST_CLASS: string = '.host';

const document: Document = window.document;
const host: HTMLElement = window.document.querySelector(HOST_CLASS);
const localizationService: LocalizationService = new LocalizationServiceImplementation();
const httpService: HttpService = new HttpServiceImplementation();
const emailService: EmailService = new EmailServiceImplementation(httpService);

new EmailInputComponent(
    document,
    host,
    localizationService,
    emailService,
).render();