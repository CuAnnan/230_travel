import Controller from "./Controller.class.js";

class TravelLogController extends Controller
{
    constructor()
    {
        super();
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
                            "Users_has_TravelLogs utl " +
                            "LEFT JOIN TravelLogs log USING (idTravelLogs) " +
                            "LEFT JOIN TravelLogs_has_Tags USING (idTravelLogs) " +
                            "LEFT JOIN Tags tag USING (idTags) " +
                        "WHERE " +
                            "utl.idUsers = ?",
            [req.user.idUsers]
        );

        let results = [];
        let lastResult = {idTravelLogs:-1};
        query.results.forEach((result) => {
            if(lastResult.idTravelLogs !== result.idTravelLogs)
            {
                if(lastResult)
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