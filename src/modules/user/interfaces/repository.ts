    import UserCreateDTO, {UserFilterDTO, UserUpdateDTO} from "../dto/user";
    import User from "../entity/user";
    import sequelize from "sequelize";
    import {FavoriteBookCreate, FavoriteBookDelete, FavoriteBookFilter} from "../dto/favorite_books";
    import {FavoriteBooks} from "../entity/favorite_books";

    export interface IUserRepository {
        CreateUser (data:UserCreateDTO, trx?:sequelize.Transaction):Promise<User | null>;
        GetAll (filter:UserFilterDTO) :Promise<User[]>;
        Get (filter:UserFilterDTO): Promise<User | null>;
        Update(data:UserUpdateDTO, trx?:sequelize.Transaction): Promise<User | null>;
    }


    export interface IFavoriteBookRepository {
        Create (data:FavoriteBookCreate, trx?:sequelize.Transaction):Promise<FavoriteBooks>
        Get (filter:FavoriteBookFilter):Promise<FavoriteBooks|null>
        Delete (filter:FavoriteBookDelete):Promise<boolean>
    }