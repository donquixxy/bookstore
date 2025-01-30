export class Pagination {
    limit:number = 10;
    page:number = 1;
    all:boolean = false;

    constructor(limit?:number, page?:number, all?:boolean) {
        if (limit) {
            this.limit = limit;
        }

        if (page) {
            this.page = page;
        }

        if (all) {
            this.all = all;
        }
    }
}