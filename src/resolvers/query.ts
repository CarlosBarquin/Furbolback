
import { ObjectId } from "mongo";
import { calculateObjectSize } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { __Directive } from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";
import { MatchCollection, PlayerCollection, TeamCollection } from "../db/dbconnection.ts";

export const Query = {
    test : () => {
        return "fwafafwaa"
    },
    player : async (_: unknown , args : {id : string}) => {
        try {
            const player = await PlayerCollection.findOne({_id: new ObjectId(args.id)})

            if(!player){
                throw new Error("no existe")
            }
            
            return player
    
        } catch (error) {
            throw new Error(error) 
        }
    },
    players : async (_: unknown , args : {team_id : string}) =>{
        try {
            if(args.team_id) {
                const players = await PlayerCollection.find({team : new ObjectId(args.team_id)}).toArray()
                return players
            }
            const players = await PlayerCollection.find({}).toArray()
            return players

        } catch (error) {
            throw new Error(error) 
        }
    },
    team : async (_: unknown , args : {id : string}) => {
        try {
            const team = await TeamCollection.findOne({_id : new ObjectId(args.id)})
            return team
        } catch (error) {
            throw new Error(error) 
        }
    },
    teams: async (_: unknown , args : { classified: boolean}) => {
        try {
           if(args.classified === true){
            const teams = await TeamCollection.find({clasificado : args.classified}).toArray()
            return teams
           }
           
           if(args.classified === false){
            const teams = await TeamCollection.find({clasificado : args.classified}).toArray()
            return teams
           }

           const teams = await TeamCollection.find({}).toArray()
           return teams

        } catch (error) {
            throw new Error(error) 
        }
    },
    match  : async (_: unknown , args : {id : string}) => {
        try {
            const m = await MatchCollection.findOne({_id : new ObjectId(args.id)})
            return m
        } catch (error) {
            throw new Error(error) 
        }
    },
    matches : async (_: unknown, args : {team : string , status : boolean , date : Date}) => {
        try {

            let filter = {};
            if (args.status) {
              filter = { status: args.status };
            }
      
            if (args.team) {
              filter = {
                ...filter,
                $or: [
                  { team1: new ObjectId(args.team) },
                  { team2: new ObjectId(args.team) },
                ],
              };
            }
            
            const DATE = new Date(args.date)

            DATE.setHours(DATE.getHours()+1)

            if (args.date) {
              filter = { ...filter, date:  DATE};
            }
      
            const matches = await MatchCollection.find(filter).toArray();
            return matches;
            
        } catch (error) {
            throw new Error(error) 
        }
    }

    
    
 };