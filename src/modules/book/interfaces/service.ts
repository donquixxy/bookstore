import {BookFilterDTO} from "../dto/book";
import {Book} from "../entity/book";

export interface IBookService {
    GetAll(filter:BookFilterDTO):Promise<{books:Book[]|null,count:number}>
}