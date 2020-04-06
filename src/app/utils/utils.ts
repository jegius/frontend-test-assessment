export enum Elements {
    DIV = 'div',
    INPUT = 'input',
    SPAN = 'span',
}

export interface ElementConfig {
    type: Elements;
    classList?: string[];
    content?: string;
    innerComponent?: HTMLElement[];
    attributes?: { [key: string]: string };
    eventListeners?: { [key: string]: () => any };
}


/**
 * Common function for create element as generic. You can provide {@link ElementConfig} and get
 * element built by this config. This function can add attributes and event listeners to create HTMLElements. You
 * also can add inner content to this element, and provide custom classes for it.
 * @params
 * @param document Document Link to root document model.
 * @param config ElementConfig Configuration of needed element.
 * @return T extends HTMLElement HTMLElement with needed properties and event listeners.
 **/
export function createElement<T extends HTMLElement>(document: Document, config: ElementConfig): T {
    const {type, classList, content, innerComponent, attributes, eventListeners} = config;
    const element: T = document.createElement(type) as T;

    if (classList) {
        element.className = classList
            .reduce((allClasses: string, className: string) => ` ${allClasses} ${className}`, '')
            .trim();
    }

    if (content) {
        element.innerHTML = content;
    }

    if (innerComponent) {
        innerComponent.forEach((component: HTMLElement) => element.appendChild(component));

    }

    if (attributes) {
        Object
            .keys(attributes)
            .forEach((key: string) => element
                .setAttribute(key, attributes[key])
            );
    }

    if (eventListeners) {
        Object
            .keys(eventListeners)
            .forEach((event: string) => element.addEventListener(event, eventListeners[event]));
    }
    return element;
}