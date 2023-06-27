export type Player = {
  id : string,
  name : string,
  team? : Team
}

export type Team = {
  id : string,
  name : string,
  players : Player[]
  partidos : Match[]
  clasificado : boolean
  GolesTotales : number  //los goles totales del team en la liga (si me te suma y si le meten resta)
}

export type Match = {
  id : string,
  terminado : boolean
  team1 : Team
  team2 : Team
  goles1 : number,
  goles2 : number
  date : Date
}