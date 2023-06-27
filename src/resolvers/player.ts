
import { TeamCollection } from "../db/dbconnection.ts";
import { TeamSchema } from "../db/schema.ts";
import { PlayerSchema } from "../db/schema.ts";

export const Player = {
    id : (parent : PlayerSchema) => {
        return parent._id.toString()
    },
    team : async (parent : PlayerSchema) => {
        try {
            const team = await TeamCollection.findOne({_id : parent.team})

            if(!team){
                throw new Error("no tiene equipo")
            }
            return team
        } catch (error) {
            throw new Error(error)
        }
    }
};
