import {Sequelize} from "sequelize";
import DatabaseConfig from "../config/database";
import Logger from "../utils/logger"
import database from "../config/database";
import {singleton} from "tsyringe";


@singleton()
class DbProvider {
    private readonly seq:Sequelize;

    constructor() {
       const dbCfg = new DatabaseConfig()
       this.seq = new Sequelize({
           dialect: "mysql",
           password: dbCfg.password,
           host: dbCfg.host,
           username: dbCfg.username,
           port: dbCfg.port,
           database:dbCfg.dbname,
           timezone:"+08:00"
       })
        this.testConnection().then(r => {})
    }


    async testConnection () {
        try {
         await this.seq.authenticate()
            Logger.log("info", "Connected to database")
        }catch (error) {
            Logger.log("error", `error connecting to database ${error}`);
        }
    }

    public getSequelize () {
        return this.seq;
    }
}


export default DbProvider;