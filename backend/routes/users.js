import express from 'express';
import UserController from '../controllers/UserController.class.js';

const controller = UserController.getInstance();

const router = express.Router();

router.get(
    '/',
    controller.checkForJWTToken,
    (req, res)=>
    {
        controller.getLoggedInUser(req, res).catch((error)=>{
            console.warn(error);
        });
    }
);

router.post('/', (req, res)=>{
    controller.logUserIn(req, res).catch(error=>{
        console.warn(error);
    });
});

router.patch(
    '/',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.updateUser(req, res).catch(error=>{
            console.warn(error);
        });
    }
);

router.delete(
    '/',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.deleteUser(req, res).catch(error=>{
            console.warn(error);
        });
    }
)

router.post('/register', (req, res)=>{
    controller.addUser(req, res).catch((err)=>{
        console.warn(err);
    });
});

export default router;