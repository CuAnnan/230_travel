import Controller from '../controllers/Controller.class.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import conf from '../conf.js';

const PASSWORD_SALTS = 15;

class UserController extends Controller
{
    static #instance;

    static
    {
        this.#instance = new UserController();
    }


    constructor()
    {
        super();
    }

    async getLoggedInUser(req, res)
    {
        let user = null;
        if(req.user)
        {
            user = req.user;
        }
        res.json({user});
    }

    confirmUserId(username, password)
    {
        const userNotFoundError = "Username or password incorrect";

        return new Promise(async (resolve, reject)=>{
            let query = await this.query(
                "SELECT idUsers, passwordHash, username, email, address FROM Users where username = ?",
                [username]
            );
            let user = query.results[0];
            if(!user)
            {
                reject(userNotFoundError);
                return;
            }
            bcrypt.compare(password, user.passwordHash, (err, result) => {
                if (err) {
                    reject(userNotFoundError);
                } else {
                    if(result)
                    {
                        resolve(user);
                    }
                    else
                    {
                        reject(userNotFoundError);
                    }
                }
            });
        });
    }


    async logUserIn(req, res)
    {
        try
        {
            let user = await this.confirmUserId(req.body.username, req.body.password);
            delete user.passwordHash;
            const userToken = Object.assign({}, user);

            const accessToken = jwt.sign(userToken,conf.express.jwt.secret,{expiresIn: '1m'});
            const refreshToken = jwt.sign(userToken, conf.express.jwt.secret, {expiresIn: '1d'});
            res.status(200).json({login: true, accessToken, refreshToken, user:userToken});
        }
        catch(err)
        {
            console.log(err);
            res.status(401).json({login:false, errors:["Username or password incorrect"]});
        }
    }

    async addUser(req, res)
    {
        let fields = ['username', 'password', 'email', 'address'];
        let errors = [];
        for(let field of fields)
        {
            if(!req.body[field])
            {
                errors.push(`Field ${field} is required`);
            }
        }
        if(req.body.passwordConfirmation !== req.body.password)
        {
            errors.push("Password strings don't match");
        }
        if(errors.length)
        {
            res.status(500).json({login:false, errors: errors});
            return;
        }

        let hash = await this.generatePasswordHash(req.body.password, PASSWORD_SALTS);

        this.query(
            'INSERT INTO Users ' +
                            '(username, passwordHash, email, address) ' +
                        'VALUES ' +
                            '(?, ?, ?, ?)',
            [req.body.username, hash, req.body.email, req.body.address]
        ).then((query)=>{
            res.json(query.results);
        }).catch((err)=>{
            if(err.code === 'ER_DUP_ENTRY')
            {
                res.status(500).json({login:false, errors:["Duplicate email or username"]});
            }
            else
            {
                console.log(err);
                res.status(500).json({login:false, errors:["Unexpected error"]});
            }

        });
    }

    async updateUser(req, res)
    {
        if(!req.user)
        {
            res.status(500).json({update:false, errors:["Authentication failed"]});
            return;
        }

        try
        {
            const user = await this.confirmUserId(req.user.username, req.body.password);
            const fields = ['email', 'address'];
            const fieldValues = [];
            const sqlFields = [];
            const errors = [];

            for(let field of fields)
            {
                if(!req.body[field])
                {
                    errors.push(`Field ${field} is required`);
                }
                sqlFields.push(`${field} = ?`);
                fieldValues.push(req.body[field]);
            }


            if(req.body.newPassword)
            {
                if(req.body.newPassword !== req.body.passwordConfirmation)
                {
                    errors.push("Password incorrect");
                }
                sqlFields.push('passwordHash = ?')
                fieldValues.push(await this.generatePasswordHash(req.body.newPassword, PASSWORD_SALTS));
            }
            fieldValues.push(user.idUsers);

            if(errors.length)
            {
                res.status(500).json({update:false, errors});
                return;
            }

            const {results} = await this.query(
                `UPDATE Users SET ${sqlFields.join(', ')} WHERE idUsers = ?`,
                fieldValues
            );
            res.json({results});
        }
        catch(err)
        {
            console.log(err);
            res.status(500).json({update:false, errors:["Authentication failed"]});
        }
    }

    async generatePasswordHash(password, saltRounds)
    {
        return new Promise(
            (resolve, reject)=>{
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if(err)
                    {
                        reject(err);
                    }
                    resolve(hash);

                });
            }
        );

    }

    async deleteUser(req, res)
    {
        console.log(req.body);
        try
        {
            await this.confirmUserId(req.user.username, req.body.password);
            await this.query("DELETE FROM Users WHERE idUsers = ?", [req.user.idUsers]);
            res.json({deleted:true});
        }
        catch(err)
        {
            console.log(err);
            res.status(401).json({deleted:false, errors:["Password verification failed"]});
        }

    }

    static getInstance()
    {
        return this.#instance;
    }
}

export default UserController;