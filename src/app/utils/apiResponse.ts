export interface ApiResponse<T>{
    data:T
    message:string;
    success:boolean;
    statusCode:number;
}

export interface ApiResponse2<T>{
    data:T[]
    message:string;
    success:boolean;
    statusCode:number;
}