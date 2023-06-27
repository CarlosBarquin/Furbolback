
import { MatchCollection, PlayerCollection, TeamCollection } from "../db/dbconnection.ts";
import { TeamSchema } from "../db/schema.ts";
import { PlayerSchema } from "../db/schema.ts";

const TeamResolver = {
    id : (parent : TeamSchema) => {
        return parent._id.toString()
    },
    players : async (parent : TeamSchema) => {
        try {
            const players = await PlayerCollection.find({team : parent._id}).toArray()
            return players
        } catch (error) {
            throw new Error(error)
        }
    },
    partidos : async (parent : TeamSchema) => {
        try {
            const matches = await MatchCollection.find({ $or : [
                { team1: parent._id },
                { team2: parent._id },
              ],}).toArray()

              return matches
            
        } catch (error) {
            throw new Error(error)
        }
    },
    GolesTotales : async (parent : TeamSchema) => {
        try {
            const matches = await MatchCollection.find({team1 : parent._id}).toArray()
            const matches2 = await MatchCollection.find({team2 : parent._id}).toArray()
            let goles = 0
            matches.map((match)=> {
                goles = goles + match.goles1
                goles = goles - match.goles2
            })

            matches2.map((match)=> {
                goles = goles + match.goles2
                goles = goles - match.goles1
            })
            
            return goles

        } catch (error) {
            throw new Error(error)
        }
    }
}

export default TeamResolver