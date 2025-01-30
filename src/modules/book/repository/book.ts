import {IBookRepository} from "../interfaces/repository";
import {inject, injectable} from "tsyringe";
import DbProvider from "../../../database/sequelize";
import {BookCreateDTO, BookFilterDTO, BookUpdateDTO} from "../dto/book";
import {Book} from "../entity/book";
import {DbError} from "../../../error/error";
import logger from "../../../utils/logger";
import {Op} from "sequelize";
import e from "cors";


@injectable()
export class BookRepository implements IBookRepository {
    private readonly dbProvider:DbProvider

    constructor(@inject("DbProvider") dbProvider:DbProvider) {
        this.dbProvider = dbProvider
    }

    async Create(data: BookCreateDTO): Promise<Book|null> {
        try {
            const result = await Book.create({
                id:data.id,
                title:data.title,
                description:data.description,
                author_name:data.authorName
            })

            if (!result) {
                logger.log("error", "Failed to insert book to database")
                return null
            }

            return result
        }catch (e) {
            logger.log("error", `Failed to insert book to database with exception caught ${e}`)
            return null
        }
    }

    async Get(filter: BookFilterDTO): Promise<Book | null> {
        try {
            const whereClause: any = {};

            if (filter.id && filter.id !== "") {
                whereClause.id = filter.id;
            }

            if (filter.title && filter.title !== "") {
                whereClause.title = { [Op.like]: `%${filter.title}%` };
            }

            if (filter.authorName && filter.authorName !== "") {
                whereClause.author_name = { [Op.like]: `%${filter.authorName}%` };
            }

            return await Book.findOne({where:whereClause})
        }catch(e) {
            logger.log("error", "Failed to find single book with exception caught ${e}`)")
            return null
        }
    }

    async GetAll    (filter:BookFilterDTO):Promise<{books:Book[]|null; count:number}> {
        try {
            const whereClause: any = {};

            if (filter.id && filter.id !== "") {
                whereClause.id = filter.id;
            }

            if (filter.title && filter.title !== "") {
                whereClause.title = { [Op.like]: `%${filter.title}%` };
            }

            if (filter.authorName && filter.authorName !== "") {
                whereClause.author_name = { [Op.like]: `%${filter.authorName}%` };
            }

            whereClause.deleted_at = {[Op.is]: null}

            let paginationOptions = {};
            if (!filter.pagination?.all) {
                paginationOptions = {
                    limit: filter.pagination?.limit ?? 10,
                    offset: ((filter.pagination?.page ?? 1) - 1) * (filter.pagination?.limit ?? 10),
                };
            }

            const { rows: books, count } = await Book.findAndCountAll({
                where: whereClause,
                ...paginationOptions,
                order: [["created_at", "DESC"]]
            });

            return {books:books, count:count};
        }catch(e) {
            logger.log("error", `Failed to find book with exception caught ${e})`)
            return {books:null, count:0}
        }
    }

  async  Update(data: BookUpdateDTO): Promise<Book | null> {
       try{

           const updateClause:any = {}

           if (data.authorName) {
               updateClause.author_name = data.authorName
           }

           if (data.description) {
               updateClause.description = data.description
           }

           if (data.title) {
               updateClause.title = data.title
           }

           const [affectedRows] = await Book.update(updateClause,{
               where: {
                   id:data.id,
               }
           })

           if (affectedRows == 0 ) {
               logger.log("error", `Failed to update book with affectedRows: ${affectedRows})`)
               return null
           }

           // fetch updated data
           const bookFilter = new BookFilterDTO()
           bookFilter.id = data.id

           return await this.Get(bookFilter)
       }catch (er) {
           logger.log("error", `Failed to update book with error ${e}`)
           return null

       }
    }


}