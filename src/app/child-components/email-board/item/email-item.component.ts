import { createElement, ElementConfig, Elements } from '../../../utils/utils';
import { DeepCallbackType, EMAIL_VALIDATION, ButtonKey } from '../../../services/common-api';
import { EmailModel } from '../../../services/email/email.service.api';

export interface EmailItem {
    selfElement: HTMLElement;

    removeEmail(): void;
}

export class EmailItemComponent implements EmailItem {
    readonly CLASS: string = 'emails-item';
    readonly selfElement: HTMLElement;
    private inputElement: HTMLInputElement;
    private readonly ELEMENT_TYPE: Elements = Elements.DIV;
    private readonly VALID_SIZE_RENT: number = 10;
    private readonly INVALID_SIZE_RENT: number = 20;
    private readonly MIN_INPUT_SIZE: number = 1;

    readonly config: ElementConfig = {
        type: this.ELEMENT_TYPE
    };

    constructor(
        private readonly document: Document,
        private readonly host: HTMLElement,
        readonly emailModel: EmailModel,
        private readonly callbacks: { [key: string]: () => any },
    ) {
        this.selfElement = createElement(document, {
            ...this.config, ...{
                classList: [
                    this.CLASS,
                    EMAIL_VALIDATION.test(emailModel.email) ? `${this.CLASS}_valid` : `${this.CLASS}_invalid`
                ]
            }
        });
        this.initComponent();
    }

    /**
     * Method for remove this element from dom with call of remove and check emails
     * callbacks see: {@link DeepCallbackType}.
     * @return void.
     **/
    removeEmail(): void {
        this.callbacks[DeepCallbackType.REMOVE_EMAIL].call(null, this.emailModel.id);
        this.host.removeChild(this.selfElement);
        this.callbacks[DeepCallbackType.CHECK_EMAILS]();
    }

    /**
     * @internal Method for html class control according input value.
     * @params
     * @param event KeyboardEvent Event of keyboard provided by event listener.
     * return void.
     **/
    onEmailChange(event: KeyboardEvent): void {
        event.stopPropagation();
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this.setValue(target.value);

        EMAIL_VALIDATION.test(target.value) ?
            this.setClass(`${this.CLASS}_invalid`, `${this.CLASS}_valid`) :
            this.setClass(`${this.CLASS}_valid`, `${this.CLASS}_invalid`);

        target.setAttribute('size', this.getSize(target.value));

        if (event.key === ButtonKey.ENTER || event.key === ButtonKey.COMMA) {
            event.preventDefault();
            target.blur();
        }
    }

    /**
     * @internal Function will call after blur event trigger from blur event listener. This function should
     * select action by current email model value and new email input value.
     * @params
     * @param event Event Event provided by blur listener.
     * @return void.
     **/
    onBlur(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;

        if (this.emailModel.id) {
            target.value ?
                this.updateEmail(target.value) :
                this.removeEmail();
        } else {
            target.value ?
                this.addNewEmail(target.value) :
                this.host.removeChild(this.selfElement);
        }
    }

    private addNewEmail(value: string): void {
        this.emailModel.email = value;
        this.callbacks[DeepCallbackType.ADD_NEW_EMAIL].call(null, value, this.setId.bind(this));
        this.callbacks[DeepCallbackType.CHECK_EMAILS]();
    }

    private setValue(value: string): void {
        this.emailModel.email = value;
        this.inputElement.value = value;
        this.callbacks[DeepCallbackType.CHECK_EMAILS]();
    }

    private setClass(previousClass: string, nextClass: string): void {
        if (this.selfElement.classList.contains(nextClass)) {
            return;
        }

        this.selfElement.classList.remove(previousClass);
        this.selfElement.classList.add(nextClass);
    }

    private setId({id}: EmailModel): void {
        this.emailModel.id = id;
    }

    private updateEmail(email: string): void {
        this.callbacks[DeepCallbackType.UPDATE_EMAIL].call(null, {
            ...this.emailModel,
            ...{email}
        });
        this.callbacks[DeepCallbackType.CHECK_EMAILS]();
    }

    private initComponent(): void {
        this.inputElement = createElement(document, {
            type: Elements.INPUT,
            classList: [`${this.CLASS}__input`],
            eventListeners: {
                keydown: checkPressButton.bind(this),
                input: this.onEmailChange.bind(this),
                blur: this.onBlur.bind(this),
            },
            attributes: {
                type: 'input',
                value: this.emailModel.email,
                size: this.getSize(),
            }
        });
        [
            this.inputElement,
            createElement(document, {
                type: Elements.SPAN,
                classList: [`${this.CLASS}__close-button`],
                eventListeners: {
                    click: this.removeEmail.bind(this)
                },
            })
        ].forEach((element: HTMLElement) => this.selfElement.appendChild(element));

        if (!this.emailModel.email) {
            this.selectItem(this.inputElement);
        }
    }

    private selectItem(input: HTMLInputElement): void {
        setTimeout(() => {
            input.focus();
        }, 0);
    }

    private getSize(value: string = this.emailModel.email): string {
        return `${this.calculateBaseSize(value.length, EMAIL_VALIDATION.test(value) ?
            this.VALID_SIZE_RENT :
            this.INVALID_SIZE_RENT)}`;
    }

    private calculateBaseSize(baseValue: number, percent: number): number {
        const result: number = baseValue - (baseValue * percent / 100);
        return result > this.MIN_INPUT_SIZE ?
            result :
            this.MIN_INPUT_SIZE;
    }
}


/**
 * Function for blur event listener. This function need for detect press on ENTER and COMMA buttons.
 * @params
 * @param event KeyboardEvent Callback form event listener.
 * @return void
 **/
export function checkPressButton(event: KeyboardEvent): void {
    event.stopPropagation();
    const target: HTMLInputElement = event.target as HTMLInputElement;

    if (event.key === ButtonKey.ENTER || event.key === ButtonKey.COMMA) {
        event.preventDefault();
        target.blur();
    }
}