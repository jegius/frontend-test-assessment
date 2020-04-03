export enum Elements {
    DIV = 'div',
    INPUT = 'input',
    SPAN = 'span'
}

export interface ElementConfig {
    type: Elements,
    classList?: string[],
    content?: string,
    innerComponent?: HTMLElement[],
    attributes?: { [key: string]: string },
    eventListeners?: { [key: string]: () => any }
}

export function createElement(document: Document, config: ElementConfig): HTMLElement {
    const {type, classList, content, innerComponent, attributes, eventListeners} = config;
    const element: HTMLElement = document.createElement(type) as HTMLElement;
    element.classList.add(...classList);

    if (content) {
        element.innerHTML = content;
    }

    if (innerComponent) {
        innerComponent.forEach((component: HTMLElement) => element.appendChild(component))

    }

    if (attributes) {
        Object
            .keys(attributes)
            .forEach((key: string) => element
                .setAttribute(key, attributes[key])
            )
    }

    if (eventListeners) {
        Object
            .keys(eventListeners)
            .forEach((event: string) => {
                element.addEventListener(event, eventListeners[event])
            })
    }
    return element;
}