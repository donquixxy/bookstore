    import UserCreateDTO, {UserFilterDTO, UserUpdateDTO} from "../dto/user";
    import User from "../entity/user";
    import sequelize from "sequelize";

    export interface IUserRepository {
        CreateUser (data:UserCreateDTO, trx?:sequelize.Transaction):Promise<User | null>;
        GetAll (filter:UserFilterDTO) :Promise<User[]>;
        Get (filter:UserFilterDTO): Promise<User | null>;
        Update(data:UserUpdateDTO, trx?:sequelize.Transaction): Promise<User | null>;
    }

