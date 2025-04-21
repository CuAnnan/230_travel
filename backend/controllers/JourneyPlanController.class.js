import Controller from './Controller.class.js';

class JourneyPlanController extends Controller
{
    static #instance;
    static {
        this.#instance = new JourneyPlanController();
    }

    constructor()
    {
        super();
    }

    getQueryPlaceHolders(fieldArray)
    {
        let oneDPlaceHolders = [], twoDPlaceHolders = [];

        for(let field of fieldArray)
        {
            oneDPlaceHolders.push('?');
            twoDPlaceHolders.push('(?, ?)');
        }
        return {oneDPlaceHolders, twoDPlaceHolders};
    }

    async addActivities(idPlans, activities)
    {
        const {oneDPlaceHolders, twoDPlaceHolders} = this.getQueryPlaceHolders(activities);

        let replaceQry = await this.query(`INSERT INTO Activities (name) VALUES (${oneDPlaceHolders.join('), (')}) ON DUPLICATE KEY UPDATE name=name`, activities);
        let idsQuery = await this.query(`SELECT idActivities, name from Activities where name in (${oneDPlaceHolders.join(', ')})`, activities);
        let activityIds = [];
        let insertArray =  [];
        let locationsArray = [];
        for(let row of idsQuery.results)
        {
            activityIds.push(row.idActivities);
            locationsArray.push(row)
            insertArray.push(row.idActivities);
            insertArray.push(idPlans);
        }
        await this.query(`DELETE FROM JourneyPlan_has_Activities WHERE idJourneyPlans = ? AND idActivities NOT IN (${oneDPlaceHolders.join(', ')})`, [idPlans, ...activityIds]);
        await this.query(`INSERT INTO JourneyPlan_has_Activities (idActivities, idJourneyPlans) VALUES ${twoDPlaceHolders.join(', ')} ON DUPLICATE KEY UPDATE idActivities=idActivities`, insertArray);
        return locationsArray;
    }

    async addLocations(idPlans, locations)
    {
        const {oneDPlaceHolders, twoDPlaceHolders} = this.getQueryPlaceHolders(locations);

        let replaceCountriesQuery = await this.query(`INSERT INTO Locations (name) VALUES (${oneDPlaceHolders.join('), (')}) ON DUPLICATE KEY UPDATE name=name`, locations);
        let idsQuery = await this.query(`SELECT idLocations, name from Locations where name in (${oneDPlaceHolders.join(', ')})`, locations);
        let locationIds = [];
        let insertArray =  [];
        let locationsArray = [];
        for(let row of idsQuery.results)
        {
            locationIds.push(row.idLocations);
            locationsArray.push(row)
            insertArray.push(row.idLocations);
            insertArray.push(idPlans);
        }
        await this.query(`DELETE FROM JourneyPlan_has_Locations WHERE idJourneyPlans = ? AND idLocations NOT IN (${oneDPlaceHolders.join(', ')})`, [idPlans, ...locationIds]);
        await this.query(`INSERT INTO JourneyPlan_has_Locations (idLocations, idJourneyPlans) VALUES ${twoDPlaceHolders.join(', ')} ON DUPLICATE KEY UPDATE idLocations=idLocations`, insertArray);
        return locationsArray;
    }

    async addPlan(req, res)
    {
        await this.beginTransaction();

        try
        {
            const plansQry = await this.query(
                "INSERT INTO JourneyPlans (idUsers, name, startDate, endDate, description) VALUES (?, ?, ?, ?, ?)",
                [req.user.idUsers, req.body.name, req.body.startDate, req.body.endDate, req.body.description]
            );
            const idPlans = plansQry.results.insertId;
            const activityIds = this.addActivities(idPlans, req.body.activities);
            const countryIds = this.addLocations(idPlans, req.body.locations);

            await this.commit();
            this.res({idPlans, activityIds, countryIds});
        }
        catch(e)
        {
            await this.rollback();
            res.status(500).send({error:"Unanticipated error occurred"});
        }
    }

    async deletePlan(req, res)
    {
        await this.query("DELETE FROM JourneyPlans WHERE idUsers = ? AND idJourneyPlans = ?", [req.user.idUsers, req.params.idJourneyPlans]);
        res.json({deleted:true});
    }

    async updatePlan(req, res)
    {
        await this.beginTransaction();

        try
        {
            await this.query(
                "UPDATE JourneyPlans SET name = ?, startDate = ?, endDate = ?, description = ? WHERE idJourneyPlans = ? AND idUsers = ?",
                [req.body.name, req.body.startDate, req.body.endDate, req.body.description, req.body.idJourneyPlans, req.user.idUsers],
            );

            const activityIds = this.addActivities(req.body.idJourneyPlans, req.body.activities);
            const countryIds = this.addLocations(req.body.idJourneyPlans, req.body.locations);


            await this.commit();
            res.json({activityIds, countryIds});
        }
        catch(e)
        {
            await this.rollback();
            res.status(500).send({error:"Unanticipated error occurred"});
        }
    }

    async getPlansByUserId(req, res)
    {
        const plansQry = await this.query(
            "SELECT " +
                            "jp.* " +
                        "FROM " +
                            "JourneyPlans jp " +
                        "WHERE " +
                            "jp.idUsers = ?",
            [req.user.idUsers]
        );
        const plans = [];

        for(let planRow of plansQry.results)
        {
            const plan = Object.assign({}, planRow);
            plan.activities = [];
            plan.locations = [];

            const activitiesQry = await this.query(
                "SELECT " +
                                "a.* " +
                            "FROM " +
                                "JourneyPlan_has_Activities jhp " +
                                "LEFT JOIN Activities a USING (idActivities) " +
                            "WHERE " +
                                "jhp.idJourneyPlans = ?",
                [plan.idJourneyPlans]
            );
            for(let activityRow of activitiesQry.results)
            {
                const activity = Object.assign({}, activityRow);
                plan.activities.push(activity);
            }

            const locationsQry = await this.query(
                "SELECT " +
                                "l.*" +
                            "FROM " +
                                "JourneyPlan_has_Locations jhl " +
                                "LEFT JOIN Locations l USING (idLocations) " +
                            "WHERE " +
                                "jhl.idJourneyPlans = ?",
                [plan.idJourneyPlans]
            );
            for(let locationRow of locationsQry.results)
            {
                const location = Object.assign({}, locationRow);
                plan.locations.push(location);
            }

            plans.push(plan);
        }
        res.json({plans});
    }

    static getInstance()
    {
        return this.#instance;
    }
}

export default JourneyPlanController;