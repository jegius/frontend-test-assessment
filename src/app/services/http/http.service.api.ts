export abstract class HttpService {
    readonly BASE_URL: string = '/api';

    abstract get(): Promise<any>;
}