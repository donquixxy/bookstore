import UserCreateDTO, {LoginDTO, UserFilterDTO} from "../dto/user";
import sequelize from "sequelize";
import User from "../entity/user";
import {AuthResponse} from "../model/jwt";


export interface IUserService {
    CreateUser (data:UserCreateDTO, trx?:sequelize.Transaction):Promise<User | null>;
    GetAll (filter:UserFilterDTO):Promise<User[]>;
    Login(request:LoginDTO):Promise<AuthResponse | null>;
}