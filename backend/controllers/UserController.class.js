import Controller from '../controllers/Controller.class.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import conf from '../conf.js';

const PASSWORD_SALTS = 15;

class UserController extends Controller
{
    static instance;

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

    async logUserIn(req, res)
    {
        this.query(
            "SELECT idUsers, passwordHash, username, email, address FROM Users where username = ?",
            [req.body.username]
        ).then((query)=> {
            let user = query.results[0];
            if(user)
            {
                bcrypt.compare(req.body.password, user.passwordHash, (err, result) => {
                    if (err) {
                        res.status(400);
                        res.json({login: false});
                    } else {
                        delete user.passwordHash;
                        const userAsJSON = Object.assign({}, user);
                        const userToken = Object.assign({}, user);
                        userToken.exp = Math.floor(Date.now() / 1000) + 3600;
                        const token = jwt.sign(
                            userToken,
                            conf.express.jwt.secret
                        );
                        res.status(200).json({login: true, token, user:userAsJSON});
                    }
                });
            }
            else
            {
                res.status(400);
                res.json({login: false});
            }
        });
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
            res.status(500);
            res.json({errors: errors});
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
                res.json({login:false, reason:"Duplicate email or username"});
            }
            else
            {
                res.status(500);
                res.json({login:false, reason:"Unexpected error"});
            }

        });
    }

    async updateUser(req, res)
    {
        let fields = [];
        let fieldValues = [];

        let fieldsToCheck = ["username", "email", "address"];

        for(let fieldToCheck of fieldsToCheck)
        {
            if(req.body[fieldToCheck])
            {
                fields.push(`${fieldToCheck} = ?`);
                fieldValues.push(req.body[fieldToCheck]);
            }
        }

        if(req.body.password)
        {
            if(req.body.password === req.body.passwordConfirmation)
            {
                fields.push('passwordHash = ?');
                fieldValues.push(await this.generatePasswordHash(req.body.password, PASSWORD_SALTS));
            }
            else
            {
                this.sendErrorResponse(res, "Passwords don't match");
            }
        }
        let sqlString = "UPDATE Users SET "+fields.join(', ')+" WHERE idUsers = ?";
        fieldValues.push(req.body.idUsers);

        this.query(
            sqlString,
            fieldValues
        ).then((query)=>{
            res.json({update:true});
        }).catch((err)=>{
            this.sendErrorResponse(res, err.message);
        });
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
        if(!req.user)
        {
            res.status(400).json({authenticated:false});
            return;
        }

        let query = await this.query('SELECT passwordHash from Users WHERE idUsers = ?',[req.user.idUsers]);
        let row = query.results[0];
        if(row)
        {
            bcrypt.compare(req.body.password, row.passwordHash, (err, result) => {
                if(err)
                {
                    res.status(400).json({authenticated:false});
                }
                else
                {
                    this.query("DELETE FROM Users WHERE idUsers = ?", [req.user.idUsers]);
                    res.json({deleted:true});
                }
            });
        }
        this.sendErrorResponse(res, "Unanticipated error");
    }

    static getInstance()
    {
        if(!this.instance)
        {
            this.instance = new UserController();
        }
        return this.instance;
    }
}

export default UserController;