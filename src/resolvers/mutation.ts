
import { ObjectId } from "mongo";
import * as bcrypt from "bcrypt";
import { MatchCollection, PlayerCollection, TeamCollection } from "../db/dbconnection.ts";
import { MatchSchema, PlayerSchema, TeamSchema } from "../db/schema.ts";
import identityFunc from "https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/identityFunc.js";
import { update } from "https://deno.land/x/mongo@v0.31.1/src/collection/commands/update.ts";

export const Mutation = {
   createPlayer : async(_:unknown , args : {name : string, team : string}) =>{
        try {
            if(args.name === ""){
                throw new Error("nombre invalido")
            }
            const player = await PlayerCollection.findOne({name : args.name})

            if(player){
                throw new Error("ya existe")
            }

            const team = await TeamCollection.findOne({_id : new ObjectId(args.team)})

            if(!team){
                
                const Player : PlayerSchema = {
                    _id : new ObjectId(),
                    name : args.name,  
                }

                await PlayerCollection.insertOne(Player)

                return Player

            }

            const Player : PlayerSchema = {
                _id : new ObjectId(),
                name : args.name,  
                team : team._id
            }

            return Player

        } catch (error) {
            throw new Error(error)
        }
   },
   updatePlayer : async (_:unknown , args : {team : string, id :string}) : Promise<PlayerSchema> => {
    try {
        const Team = await TeamCollection.findOne({_id : new ObjectId(args.team)})
        
        if(!Team){
            throw new Error("no existe el equipo")
        }

        const player = await PlayerCollection.findOne({_id: new ObjectId(args.id)})

        if(!player){
            throw new Error("no existe")
        }


        await PlayerCollection.updateOne({_id : new ObjectId(args.id)}, {$set : {
            team : Team._id
        }})


        return {
            _id : player._id,
            name : player.name,
            team : new ObjectId(args.team)
        }
    } catch (error) {
        throw new Error(error)
    }
   },
   deletePlayer : async (_:unknown , args : { id : string} ) => {
        try {
            const player = await PlayerCollection.findOne({_id: new ObjectId(args.id)})

            if(!player){
                throw new Error("no existe")
            }

            await PlayerCollection.deleteOne({_id: new ObjectId(args.id)})
            
            return player
    
        } catch (error) {
            throw new Error(error) 
        }
   },
   createTeam : async (_ : unknown , args : { name : string , classified : boolean , players: string[]}) => {
        try {
            if(args.name === ""){
                throw new Error("nombre invalido")
            }

            const Team = await TeamCollection.findOne({name : args.name})

            if(Team){
                throw new Error("ya existe el equipo")
            }

            const TEAM : TeamSchema = {
                _id : new ObjectId(),
                name : args.name,
                clasificado : args.classified
            }


            if(args.players){

                if(args.players.length === 0){
                    throw new Error("numero de jugadores invalido")
                }
                
                await Promise.all(args.players.map(async (player) => {

                    const found = await PlayerCollection.findOne({_id : new ObjectId(player)})

                    if(!found){
                        throw new Error("no existe el jugador")
                    }

                    if(found.team){
                        throw new Error("ya tiene equipo ese jugador")
                    }

                    await PlayerCollection.updateOne({_id : new ObjectId(player)}, {$set : {
                        team : TEAM._id
                    }})
                }))
            }

            await TeamCollection.insertOne(TEAM)

            return TEAM
            
        } catch (error) {
            throw new Error(error)  
        }
   },
    updateTeam : async (_ : unknown , args : { id : string , classified : boolean , players: string[]})  : Promise<TeamSchema | undefined> => {
        try {
            const fOUND = await TeamCollection.findOne({_id : new ObjectId(args.id)})
            if(!fOUND){
                throw new Error("eaeafafeafea")
            }

            if(args.players){

                if(args.players.length === 0){
                    throw new Error("numero de jugadores invalido")
                }
                
                await Promise.all(args.players.map(async (player) => {

                    const found = await PlayerCollection.findOne({_id : new ObjectId(player)})

                    if(!found){
                        throw new Error("no existe el jugador")
                    }

                    await PlayerCollection.updateOne({_id : new ObjectId(player)}, {$set : {
                        team : fOUND._id
                    }})
                }))
            }


            await TeamCollection.updateOne({_id : new ObjectId(args.id)}, {$set :{
                clasificado: args.classified
            }})

            const f = await TeamCollection.findOne({_id : new ObjectId(args.id)})

            return f
        } catch (error) {
            throw new Error(error)  
        }
    },
    deleteTeam : async (_ : unknown , args : { id : string})  : Promise<TeamSchema | undefined> => {
        try {
            const fOUND = await TeamCollection.findOne({_id : new ObjectId(args.id)})
            if(!fOUND){
                throw new Error("eaeafafeafea")
            }
            

            await PlayerCollection.updateMany({team : fOUND._id}, {$unset : {
                team : new ObjectId()
            }})

            await TeamCollection.deleteOne({_id : new ObjectId(args.id)})

            return fOUND
            
        } catch (error) {
            throw new Error(error)  
        }

    },
    createMatch : async (_: unknown, args : {team1 : string , team2 : string, goles1 : number, goles2 : number , status : boolean, date : Date }) => {
        try {
            // utilizar esta notacion en el graphql date:"2002,2,23"

            const Team1 = await TeamCollection.findOne({_id : new ObjectId(args.team1)})
            const Team2 = await TeamCollection.findOne({_id : new ObjectId(args.team2)})

            if(!Team1 || !Team2){
                throw new Error("no existen lo equpido")
            }

            const DATE = new Date(args.date)

            DATE.setHours(DATE.getHours()+1)

            const  partido = await MatchCollection.findOne({date : DATE})

            if(partido){
                throw new Error("ya hay un partido en esa fecha")
            }

            const Matc : MatchSchema = {
                _id :new ObjectId(),
                team1 : Team1._id,
                team2 : Team2._id,
                goles1: args.goles1,
                goles2 : args.goles2,
                terminado : args.status,
                date : DATE
            }

            await MatchCollection.insertOne(Matc)

            return Matc
            
        } catch (error) {
            throw new Error(error)   
        }
    },
    updateMatch :  async (_: unknown, args : { id : string, goles1 : number, goles2 : number , status : boolean }) => {
        try {

            const match = await MatchCollection.findOne({_id : new ObjectId(args.id)})
            if(!match){
                throw new Error("no hay partido")
            }

            await MatchCollection.updateOne({_id: new ObjectId(args.id)}, {$set : {
                goles1 : args.goles1,
                goles2 : args.goles2,
                terminado : args.status
            }})

            
            const f = await MatchCollection.findOne({_id : new ObjectId(args.id)})

            return f

            
        } catch (error) {
            throw new Error(error)   
        }
    },
    deleteMatch :  async (_: unknown, args : { id : string}) => {
        try {
            const match = await MatchCollection.findOne({_id : new ObjectId(args.id)})
            if(!match){
                throw new Error("no hay partido")
            }

            await MatchCollection.deleteOne({_id : new ObjectId(args.id)})

            return match


        } catch (error) {
            throw new Error(error)    
        }
    }
}
