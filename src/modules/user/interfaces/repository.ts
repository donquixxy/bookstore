    import UserCreateDTO from "../dto/user";
    import User from "../entity/user";
    import sequelize from "sequelize";

    interface IUserRepository {
        CreateUser (data:UserCreateDTO, trx?:sequelize.Transaction):Promise<User | null>;
    }

    export default IUserRepository;