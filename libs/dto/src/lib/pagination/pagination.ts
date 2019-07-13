export interface IPaginationOptions {
    limit: number;
    page: number;
    sort: string;
    route?: string;
}

export class Pagination<T> {
    constructor(
        public readonly items: T[],
        public readonly itemCount: number,
        public readonly totalItems: number,
        public readonly pageCount: number,
        public readonly next?: string,
        public readonly previous?: string
    ) { }
}