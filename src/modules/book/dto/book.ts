import {IsNotEmpty, isString, IsString} from "class-validator";
import {Pagination} from "../../../utils/pagination";

export class BookCreateDTO {
    id?:string;

    @IsNotEmpty()
    @IsString()
    title?:string;

    @IsNotEmpty()
    @IsString()
    description?:string;

    @IsNotEmpty()
    @IsString()
    authorName?:string;
}

export class BookFilterDTO {
    id?:string;
    title?:string;
    authorName?:string;
    public pagination?:Pagination
}

export class BookUpdateDTO {
    id?:string;

    title?:string;
    description?:string;
    authorName?:string;
}
