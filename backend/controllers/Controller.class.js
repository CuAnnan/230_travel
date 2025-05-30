import mysql from 'mysql';
import conf from '../conf.js';
import jwt from "jsonwebtoken";

class Controller {
    static db;
    static #instance;
    static inTransaction;

    // instantiating the static database connection
    static {
        this.db = mysql.createConnection(conf.db);
        this.db.connect();
    }

    // ensure that each controller class has a static getInstance method
    static getInstance() {
        throw new Error("getInstance method not implemented.");
    }

    async refreshJWTToken(req, res)
    {
        try
        {
            const {idUsers, username, email, address} = await jwt.verify(req.body.refreshToken, conf.express.jwt.secret);
            const newUserToken = {idUsers, username, email, address};
            const accessToken = jwt.sign(newUserToken, conf.express.jwt.secret,{expiresIn: '1m'});
            const refreshToken = jwt.sign(newUserToken, conf.express.jwt.secret, {expiresIn: '1d'});
            res.status(200).json({accessToken, refreshToken});
        }
        catch(e)
        {
            console.log(e);
            res.status(500).sent({error:"An error occured"})
        }
    }

    async checkForJWTToken(req, res, next)
    {
        try
        {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = await jwt.verify(token, conf.express.jwt.secret)
            req.user = await decodedToken;
            next();
        }
        catch(e)
        {
            res.status(401).json({message:"TokenExpiredError"});
        }
    }

    query(sqlStatement, fields)
    {
        return new Promise((resolve, reject)=>{
            let stmt = Controller.db.query(sqlStatement, fields, (err, results)=>{
                let query = {
                    sql:stmt.sql,
                    qry:stmt,
                    results:[],
                    hasResults:false
                }
                if(err)
                {
                    reject(err);
                }
                if(results)
                {
                    query.results = results;
                    query.hasResults = results.length > 0;
                }

                resolve(query);
            });
        });
    }

    async beginTransaction()
    {
        await this.query("START TRANSACTION");
    }

    async commit()
    {
        await this.query("COMMIT");
    }

    async rollback()
    {
        await this.query("ROLLBACK");
    }

    sendErrorResponse(res, message="Query string failed")
    {
        console.error(message);
        //res.status(500);
        res.json({error:message});
    }

}
export default Controller;