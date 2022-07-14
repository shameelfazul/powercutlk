export class ReportModel {
    status: boolean;
    label: string;
    url: string;

    constructor (status: boolean, label: string, url: string) {
        this.label = label;
        this.status = status;
        this.url = url;
    }
}