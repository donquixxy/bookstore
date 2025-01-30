import {IBookService} from "../interfaces/service";
import {injectable, inject} from "tsyringe";
import {BookRepository} from "../repository/book";
import {BookFilterDTO} from "../dto/book";
import {Book} from "../entity/book";

@injectable()
export class BookService implements IBookService {
    private readonly bookRepository: BookRepository;

    constructor(@inject("IBookRepository")bookRepository: BookRepository) {
        this.bookRepository = bookRepository;
    }

    async GetAll(filter: BookFilterDTO): Promise<{ books: Book[]|null; count: number }> {
        return await this.bookRepository.GetAll(filter);
    }
}