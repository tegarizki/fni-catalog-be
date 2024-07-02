export class _response {
    status: string;
    message: string;
    data? : any;

    constructor(status: string, message: string, data?: any) {
        this.status = status ?? 'success';
        this.message = message ?? 'Ok';
        this.data = data;
    }
}