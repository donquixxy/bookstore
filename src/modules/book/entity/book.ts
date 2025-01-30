import {DataTypes, Model} from "sequelize";
import DbProvider from "../../../database/sequelize";
import {Pagination} from "../../../utils/pagination";

export class Book extends Model{
    public id!:string;
    public title!:string;
    public description!:string;
    public authorName!:string;
    public createdAt!:Date;
    public updatedAt!:Date;
    public deletedAt?:Date;

    public static initialize(provider: DbProvider) {
        Book.init(
         {
            id:{
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            title:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            description:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            author_name:{
                type: DataTypes.STRING,
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
                defaultValue: DataTypes.NOW,
            },
            deleted_at:{
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
                sequelize:provider.getSequelize(),
                tableName:"books",
                modelName: "Book",
                paranoid: true,
                timestamps:false,
            }
        )
    }
}