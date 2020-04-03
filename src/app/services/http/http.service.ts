import { HttpService } from './http.service.api';

export class HttpServiceImplementation extends HttpService {
    constructor() {
        super();
    }

    get(): Promise<any> {
        return Promise.resolve();
    }

}