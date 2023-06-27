import { gql } from "graphql_tag";

export const typeDefs = gql`
  
  scalar Date

  type Player {
    id : ID!
    name : String!
    team : Team!
  }

  type Team {
    id : ID!
    name : String!
    players: [Player!]!
    partidos : [Match!]!
    clasificado : Boolean!
    GolesTotales : Int!
  }

  type Match {
    id : ID!
    terminado : Boolean!
    team1 : Team!
    team2 : Team!
    goles1: Int!
    goles2: Int!
    date : Date!
  }
  type Query {
    test : String!
    teams(classified: Boolean): [Team!]!
    team(id: ID!): Team!
    matches(status: Boolean, team: ID, date: Date): [Match!]!
    match(id: ID!): Match!
    players(team_id: ID): [Player!]!
    player(id: ID!): Player!
  }

  type Mutation {

    createTeam(name: String!, players: [ID!], classified: Boolean!): Team!
    updateTeam(id: ID!, players: [ID!], classified: Boolean): Team!
    deleteTeam(id: ID!, ): Team!

    createMatch(
      team1: ID!
      team2: ID!
      goles1: Int!
      goles2: Int!
      date: Date!
      status: Boolean!
    ): Match!
    updateMatch(
      id: ID!
      goles1: Int!
      goles2: Int!
      status: Boolean!
    ): Match!
    deleteMatch(id: ID!): Match!

    createPlayer(name: String!, team : ID): Player!
    updatePlayer(team: ID!, id : ID!) : Player!
    deletePlayer(id: ID!): Player!
  }
`;
