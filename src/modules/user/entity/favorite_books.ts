import {DataTypes, Model} from "sequelize";
import DbProvider from "../../../database/sequelize";
import User from "./user";
import {Book} from "../../book/entity/book";

export class FavoriteBooks extends Model {
    public id!:string
    public userID!:string
    public bookID!:string
    public createdAt!:Date
    public updatedAt!:Date


    public user?:User
    public static initialize (provider: DbProvider) {
        FavoriteBooks.init(
            {
                id:{
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                user_id:{
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                book_id:{
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                created_at:{
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: DataTypes.NOW,
                },
                updated_at:{
                    type: DataTypes.DATE,
                    allowNull: true,
                }
            },{
                sequelize:provider.getSequelize(),
                tableName:"user_favorites",
                modelName: "FavoriteBooks",
                timestamps:false,
            }
        )
    }

    public static initAssosiation () {
        FavoriteBooks.belongsTo(User, {
            foreignKey: "user_id",
            constraints:false,
            foreignKeyConstraint:false,
            as:"user"
        })
        FavoriteBooks.belongsTo(Book, {
            foreignKey: "book_id",
            constraints:false,
            foreignKeyConstraint:false,
            as:"book"
        })
    }
}