
import { MatchCollection, PlayerCollection, TeamCollection } from "../db/dbconnection.ts";
import { MatchSchema, TeamSchema } from "../db/schema.ts";
import { PlayerSchema } from "../db/schema.ts";

const MatchResolver = {
    id : (parent : MatchSchema) => {
        return parent._id.toString()
    },
    team1: async (parent : MatchSchema) => {
        try {
            const team =  await TeamCollection.findOne({_id : parent.team1})
            return team
        } catch (error) {
            throw new Error(error)
        }
    },
    team2 : async (parent : MatchSchema) => {
        try {
            const team =  await TeamCollection.findOne({_id : parent.team2})
            return team
        } catch (error) {
            throw new Error(error)
        }
    }
    
}

export default MatchResolver