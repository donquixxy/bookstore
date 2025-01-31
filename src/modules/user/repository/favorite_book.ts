import {injectable} from "tsyringe";
import {IFavoriteBookRepository} from "../interfaces/repository";
import {FavoriteBookCreate, FavoriteBookDelete, FavoriteBookFilter} from "../dto/favorite_books";
import {FavoriteBooks} from "../entity/favorite_books";
import logger from "../../../utils/logger";
import sequelize from "sequelize";

@injectable()
export class FavoriteBookRepository implements IFavoriteBookRepository {

    async Create(data: FavoriteBookCreate, trx?:sequelize.Transaction): Promise<FavoriteBooks> {
        try {
        const result =  await FavoriteBooks.create({
              id: data.id,
              user_id:data.userID,
              book_id:data.bookID,
          }, { transaction:trx ?? null });

          if (!result) {
              throw new Error(`Failed to create favorite book with id ${data.id}`);
          }

          return result
        }catch (error) {
            logger.log("error", `[Repository] - Failed to create favorite book with caught exception ${error}`)
            throw error;
        }
    }

   async Delete(filter: FavoriteBookDelete): Promise<boolean> {
        try {
            const rowsAffected = await FavoriteBooks.destroy({
                where: {id: filter.id},
            })

            if (rowsAffected == 0 ) {
                throw new Error(`Failed to delete favorite book with id ${filter.id}`);
            }

            return true;
        }catch (error) {
            logger.log("error", `Failed to delete favorite books with caught exception ${error}`)
            throw error;
        }
    }

   async Get(filter: FavoriteBookFilter): Promise<FavoriteBooks|null> {
        try {
            const whereClause:any = {}

            if (filter.id && filter.id !== "") {
                whereClause.id = filter.id;
            }

            if (!filter.userID && filter.userID !=="") {
                whereClause.user_id = filter.userID;
            }

            if (!filter.bookID && filter.bookID !=="") {
                whereClause.book_id = filter.bookID;
            }

            return await FavoriteBooks.findOne({where: whereClause})
        }catch (error) {
            logger.log("error", "Failed to find favorite books with caught exception ${error}`)")
            throw error;
        }
    }


}