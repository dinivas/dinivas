import * as moment from 'moment';

export class Filter {
    constructor(
        public field: string,
        public label: string,
        public type: FilterType,
        public selected: boolean = false,
        public removable: boolean = true,
        public value: any = undefined
    ) { }

    static toHttpParam(filters: Filter[]): any {
        return filters
            .filter(filter => filter.value != undefined)
            .map(filter => {
                let responseFilter: any = {field: filter.field};
                if(FilterType.TEXT == filter.type){
                    responseFilter.type = 'TEXT';
                    responseFilter.value = filter.value;
                }else if(FilterType.ARRAY == filter.type){
                    responseFilter.type = 'ARRAY';
                    let arrayValue = filter.value as Array<any>;
                    responseFilter.value = arrayValue.map(val=>{
                        return {name: val,label: val};
                    })
                }else if(FilterType.COMPARATOR_EQUALS == filter.type){
                    responseFilter.type = 'COMPARATOR_EQUALS';
                    responseFilter.value = filter.value;
                }
                else if(FilterType.DATE == filter.type){
                    responseFilter.type = 'DATE';
                    responseFilter.value =  moment(filter.value).format("YYYY-MM-DD");
                }
                return responseFilter;
            })
    }
}

export class FilterArray<T> extends Filter {
    constructor(
        public field: string,
        public label: string,
        public type: FilterType = FilterType.ARRAY,
        public selected: boolean = false,
        public removable: boolean = true,
        public datas: T[] = [],
    ) {
        super(field, label, type, selected, removable);
    }
}

export class FilterText extends Filter {
    constructor(
        public field: string,
        public label: string,
        public type: FilterType = FilterType.ARRAY,
        public selected: boolean = false,
        public removable: boolean = true,
        public datas: string = ''
    ) {
        super(field, label, type, selected, removable);
    }
}

export enum FilterType {
    ARRAY, TEXT, DATE, DATE_RANGE, BOOLEAN, COMPARATOR_EQUALS, COMPARATOR_BETWEEN, COMPARATOR_LESSTHAN, COMPARATOR_GREATERTHAN
}