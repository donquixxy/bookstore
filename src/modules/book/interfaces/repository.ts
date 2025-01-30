import {BookCreateDTO, BookFilterDTO, BookUpdateDTO} from "../dto/book";
import {Book} from "../entity/book";

export interface IBookRepository {
    Create (data:BookCreateDTO):Promise<Book|null>
    Get(filter:BookFilterDTO):Promise<Book|null>
    GetAll(filter:BookFilterDTO):Promise<{books:Book[]|null; count:number}>
    Update (data:BookUpdateDTO):Promise<Book|null>
}