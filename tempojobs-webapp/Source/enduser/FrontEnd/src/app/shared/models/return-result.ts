export class ReturnResult<T>{
    message: string;
    result: T
}
export class ReturnSearchResult<T> extends  ReturnResult<T>{
    total: number;
}

export class AccountOpportunityResult<T> extends  ReturnResult<T>{
    referenceObject : any;
}