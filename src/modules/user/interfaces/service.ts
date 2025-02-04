import UserCreateDTO, {LoginDTO, UserFilterDTO} from "../dto/user";
import sequelize from "sequelize";
import User from "../entity/user";
import {AuthResponse} from "../model/jwt";
import {FavoriteBookDTO, FavoriteBookFilter} from "../dto/favorite_books";
import {FavoriteBooks} from "../entity/favorite_books";


export interface IUserService {
    CreateUser (data:UserCreateDTO, trx?:sequelize.Transaction):Promise<User | null>;
    GetAll (filter:UserFilterDTO):Promise<User[]>;
    Login(request:LoginDTO):Promise<AuthResponse | null>;
    Get(filter:UserFilterDTO):Promise<User|null>
}

export interface IFavoriteBookService {
    Get (filter:FavoriteBookFilter):Promise<FavoriteBooks|null>
    FavoriteBook (data:FavoriteBookDTO):Promise<string>
}