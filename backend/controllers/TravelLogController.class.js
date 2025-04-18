import Controller from "./Controller.class.js";

class TravelLogController extends Controller
{
    constructor()
    {
        super();
    }

    async insertAndGetTags(tags, idTravelLogs)
    {
        let replacePlaceHolders = [];
        let selectPlaceHolders = [];
        let joinerPlaceHolders = [];

        for(let tag of tags)
        {
            replacePlaceHolders.push('(?)');
            selectPlaceHolders.push('?');
            joinerPlaceHolders.push('(?, ?)');
        }

        let replaceTagsQuery = await this.query("INSERT INTO Tags (tag) VALUES "+replacePlaceHolders.join(', ')+" ON DUPLICATE KEY UPDATE tag=tag", tags);
        let idsQuery = await this.query(`SELECT idTags, tag from Tags where tag in (${selectPlaceHolders.join(', ')})`, tags);
        let tagIds = [];
        let insertArray =  [];
        let tagsArray = [];
        for(let row of idsQuery.results)
        {
            tagIds.push(row.idTags);
            tagsArray.push(row)
            insertArray.push(row.idTags);
            insertArray.push(idTravelLogs);
        }
        await this.query(`DELETE FROM TravelLogs_has_Tags WHERE idTravelLogs = ? AND idTags NOT IN (${selectPlaceHolders.join(', ')})`, [idTravelLogs, ...tagIds]);
        await this.query(`INSERT INTO TravelLogs_has_Tags (idTags, idTravelLogs) VALUES ${joinerPlaceHolders.join(', ')} ON DUPLICATE KEY UPDATE idTags=idTags`, insertArray);
        return tagsArray;
    }

    async addTravelLog(req, res)
    {
        if(!req.user)
        {
            res.status(500).json({add:false, errors:["Authentication failed"]});
            return;
        }
        await this.beginTransaction();
        try
        {
            const insertQRY = await this.query("INSERT INTO TravelLogs (idUsers, title, startDate, endDate, description) VALUES (?, ?, ?, ?, ?)", [req.user.idUsers, req.body.title, req.body.startDate, req.body.endDate, req.body.description]);
            const idTravelLogs = insertQRY.results.insertId;
            let tags = await this.insertAndGetTags(req.body.tags, idTravelLogs);

            res.json({insertId:insertQRY.results.insertId, tags});
            await this.commit();
        }
        catch(err)
        {
            console.log(err);
            res.json({error:"Unexpected error occurred"});
            await this.rollback();
        }
    }

    async getTravelLogsForUser(req, res)
    {
        if(!req.user)
        {
            res.status(500).json({update:false, errors:["Authentication failed"]});
            return;
        }

        let query = await this.query(
            "SELECT " +
                            "log.*, tag.* " +
                        "FROM " +
                            "TravelLogs log " +
                            "LEFT JOIN TravelLogs_has_Tags USING (idTravelLogs) " +
                            "LEFT JOIN Tags tag USING (idTags) " +
                        "WHERE " +
                            "log.idUsers = ?",
            [req.user.idUsers]
        );

        let results = [];
        let lastResult = {idTravelLogs:-1};
        query.results.forEach((result) => {
            if(lastResult.idTravelLogs !== result.idTravelLogs)
            {
                if(lastResult.idTravelLogs !== -1)
                {
                    results.push(lastResult);
                }
                const {idTravelLogs, startDate, endDate, postDate, title, description} = result
                lastResult = {idTravelLogs, startDate, endDate, postDate, title, description};
                lastResult.tags = [];
            }
            const {idTags, tag} = result;
            lastResult.tags.push({idTags, tag});
        });

        if(lastResult.idTravelLogs !== -1)
        {
            results.push(lastResult);
        }

        res.json(results);
    }

    static getInstance()
    {
        if(!this.instance)
        {
            this.instance = new TravelLogController();
        }
        return this.instance;
    }
}

export default TravelLogController;