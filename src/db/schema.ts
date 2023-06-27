import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { Match, Player, Team } from "../types.ts";

export type TeamSchema = Omit<
  Team,
  "id" | "partidos" | "players" | "GolesTotales"
> & {
  _id: ObjectId;

};

export type MatchSchema = Omit<Match, "id" | "team1" | "team2"> & {
  _id: ObjectId;
  team1: ObjectId;
  team2: ObjectId;
};

export type PlayerSchema = Omit<Player, "id" | "team" > & {
  _id: ObjectId;
  team? : ObjectId
};
