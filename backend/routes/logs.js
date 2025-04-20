import express from 'express';
import TravelLogController from '../controllers/TravelLogController.class.js';

const controller = TravelLogController.getInstance();

const router = express.Router();

router.get(
    '/',
    controller.checkForJWTToken,
    (req, res)=>
    {
        controller.getTravelLogsForUser(req, res).catch((error)=>{
            console.warn(error);
        });
    }
);

router.post(
    '/',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.addTravelLog(req, res).catch((error)=>{
            console.warn(error);
        });
    }
);

router.patch(
    '/',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.updateTravelLog(req, res).catch((error)=>{
            console.warn(error);
        });
    }
);

router.delete(
    '/:idTravelLogs',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.deleteTravelLog(req, res).catch((error)=>{
            console.error(error);
        })
    }
);

export default router;