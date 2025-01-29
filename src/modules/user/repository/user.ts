import {IUserRepository} from "../interfaces/repository";
import UserCreateDTO, {UserFilterDTO, UserUpdateDTO} from "../dto/user";
import Sequelize from "../../../database/sequelize";
import User from "../entity/user";
import {injectable} from "tsyringe";
import logger from "../../../utils/logger";
import sequelize, {Op} from "sequelize";


@injectable()
class UserRepository implements IUserRepository {
        private readonly dbProvider:Sequelize

        async CreateUser(data: UserCreateDTO, trx?:sequelize.Transaction): Promise<User | null> {
            try {
             const u = await User.create({
                 id:data.id,
                 name:data.email,
                 age:data.age,
                 email:data.email,
                 password:data.password,
             },{
                 transaction:trx ?? null
             })

             if (!u) {
                 logger.log("error", "an error occurred when create user")
                 return null;
             }

             return u
         }catch (e) {
            logger.log("error", `error creating user ${e}`);
            return null;
         }
        }

    constructor(dbProvider: Sequelize) {
        this.dbProvider = dbProvider;
    }

    async GetAll(filter: UserFilterDTO): Promise<User[]> {
        const whereClause: any = {};

        if (filter.name && filter.name !== "") {
            whereClause.name = { [Op.like]: `%${filter.name}%` }; // Matches names containing the filter value
        }
        if (filter.id && filter.id !== "") {
            whereClause.id = filter.id;
        }

        if (filter.email && filter.email !== "") {
            whereClause.email = filter.email;
        }

        if (filter.token && filter.token !== "") {
            whereClause.token = filter.token;
        }

        // Call the ORM's findAll method with the constructed whereClause
        return await User.findAll({
            where: whereClause,
        });
    }

   async Get(filter: UserFilterDTO): Promise<User | null> {
        try {
            const whereClause: any = {};

            if (filter.name && filter.name !== "") {
                whereClause.name = { [Op.like]: `%${filter.name}%` }; // Matches names containing the filter value
            }
            if (filter.id && filter.id !== "") {
                whereClause.id = filter.id;
            }

            if (filter.email && filter.email !== "") {
                whereClause.email = filter.email;
            }

            if (filter.token && filter.token !== "") {
                whereClause.token = filter.token;
            }

          return await User.findOne({where:whereClause})
        }catch (e) {
            logger.log("error", `error getting user single ${e}`);
            return null;
        }
    }

    async Update(data: UserUpdateDTO, trx?:sequelize.Transaction): Promise<User | null> {
        try {
            const updateClause:any= {}

            if (data.token) {
                updateClause.token =data.token;
            }

            if (data.email) {
                updateClause.email = data.email;
            }

            if (data.name) {
                updateClause.name = data.name;
            }

            if (data.password) {
                updateClause.password = data.password;
            }

            // Update the user
            const [affectedRows] = await User.update(
               updateClause
            , {
                where: {
                    id: data.id,
                },
                returning: true,
                transaction: trx ?? null,
            });

            if (affectedRows == 0) {
                logger.log("error", `error updating user affectedRows: ${affectedRows}`);
                return null
            }

            // Fetch the newly updated data
            const filterDTO = new UserFilterDTO()

            filterDTO.id = data.id
            return await this.Get(filterDTO)
        }catch (e) {
            logger.log("error", `failed updating user with error ${e}}`)
            return null
        }
    }
}

export default UserRepository;