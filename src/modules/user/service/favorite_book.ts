import {IFavoriteBookService} from "../interfaces/service";
import {IFavoriteBookRepository} from "../interfaces/repository";
import {inject, injectable} from "tsyringe";
import {FavoriteBookCreate, FavoriteBookDelete, FavoriteBookDTO, FavoriteBookFilter} from "../dto/favorite_books";
import {FavoriteBooks} from "../entity/favorite_books";
import {IBookRepository} from "../../book/interfaces/repository";
import {BookFilterDTO} from "../../book/dto/book";
import {DbError, NotFoundError} from "../../../error/error";
import logger from "../../../utils/logger";
import {v4 as uuidv4} from "uuid";


@injectable()
export class FavoriteBookService implements IFavoriteBookService {
    private favoriteBookRepository:IFavoriteBookRepository;
    private bookRepository:IBookRepository;

    constructor(@inject("IFavoriteBookRepository") repository:IFavoriteBookRepository,@inject("IBookRepository") bookRepository:IBookRepository) {
        this.favoriteBookRepository = repository;
        this.bookRepository = bookRepository;
    }

   async FavoriteBook(data: FavoriteBookDTO): Promise<string> {
        try {
            // retrieve book detail to validate
           const filter:BookFilterDTO = {
                id:data.bookID,
            }

            const foundBook = await this.bookRepository.Get(filter)

            if (!foundBook) {
                logger.log("error", "book not found")
                throw new NotFoundError("book with selected id not found")
            }

            // Check if book is already in user list favorite
            // If already in user favorite; remove it; otherwise add new entry

            const favoriteFilter:FavoriteBookFilter = {
                bookID:foundBook.id,
                userID:data.userID,
            }
            const inFavorite = await this.favoriteBookRepository.Get(favoriteFilter)

            // If already exist; delete
            if (inFavorite) {
                const deleteFilter:FavoriteBookDelete = {
                    id:inFavorite.id
                }
              const isSuccess = await this.favoriteBookRepository.Delete(deleteFilter)

               if (!isSuccess) {
                   throw new DbError("failed to delete book from list favorite")
               }
            } else {
                // If not in list; add new
                const id = uuidv4()
                const createRequest:FavoriteBookCreate = new FavoriteBookCreate(id, data.userID,data.bookID)
               const result = await this.favoriteBookRepository.Create(createRequest)

                if (!result) {
                    throw new DbError("failed to create book")
                }
            }

            return "successfully processed"
        }catch (error) {
            logger.log("error", `Failed to create book with caught exception ${error}`)
            throw error;
        }
    }

    async Get(filter: FavoriteBookFilter): Promise<FavoriteBooks|null> {
        return this.favoriteBookRepository.Get(filter);
    }


}