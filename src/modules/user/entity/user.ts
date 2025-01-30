import {Model, DataTypes, HasMany} from "sequelize";
import DbProvider from "../../../database/sequelize";
import {FavoriteBooks} from "./favorite_books";



class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public age!: number;
    public token?: string
    public password!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public deleted_at?: Date;
    public favorite_books?:FavoriteBooks[];

    public static initialize(provider: DbProvider) {
        User.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true,
                    },
                },
                age: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                token: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize: provider.getSequelize(),
                tableName: "users",
                modelName: "User",
                paranoid: true,
                timestamps:false,
            }
        );
    }

    public static initAssosiation () {
        User.hasMany(FavoriteBooks, {
            foreignKey:"user_id",
            constraints:false,
            foreignKeyConstraint:false,
            as: "favorite_books",
        })
    }
}

export default User;

