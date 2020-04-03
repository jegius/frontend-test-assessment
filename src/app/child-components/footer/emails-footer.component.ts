import { LocalizationService } from '../../services/localization/localization.service.api';
import { createElement, ElementConfig, Elements } from '../../utils/utils';

export class EmailsFooterComponent {
    selfElement: HTMLElement;
    readonly CLASS: string = 'emails-footer';
    readonly ELEMENT_TYPE: Elements = Elements.DIV;

    readonly config: ElementConfig = {
        type: this.ELEMENT_TYPE,
        classList: [
            this.CLASS
        ]
    };

    constructor(
        private readonly document: Document,
        private readonly localizationService: LocalizationService,
        private readonly callbacks: { [key: string]: () => any }
    ) {
        this.selfElement = createElement(document, this.config);
        this.initComponent();
    }

    private initComponent(): void {
        Object
            .keys(this.callbacks)
            .map((buttonType: string) => createElement(document, {
            type: Elements.INPUT,
            classList: [`${this.CLASS}__button`, `${this.CLASS}__button-${buttonType}`],
            attributes: {
                type: 'button',
                value: this.localizationService.translate(`footer.button.${buttonType}`)
            },
            eventListeners: {
                click: this.callbacks[buttonType]
            }
        })).forEach((element: HTMLElement) => this.selfElement.appendChild(element));
    }
}