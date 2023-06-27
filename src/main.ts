import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

import { typeDefs } from "./schema.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Query } from "./resolvers/query.ts";
import { Player } from "./resolvers/player.ts";
import TeamResolver from "./resolvers/team.ts";
import MatchResolver from "./resolvers/match.ts";
const resolvers = {
  Query,
  Mutation,
  Player : Player,
  Team : TeamResolver,
  Match: MatchResolver
};

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);