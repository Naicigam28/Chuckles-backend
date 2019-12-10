var express = require("express");
const fetch = require("node-fetch");
var express_graphql = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");
var cors = require("cors");
var app = express();
app.use(cors());

app.get("/", function(req, res) {
  res.send("Another API that provides Chuck Norris Jokes");
});

const JokeType = new GraphQLObjectType({
  name: "Joke",
  description: "This represents a book written by an author",
  fields: () => {
    return {
      categories: { type: GraphQLNonNull(GraphQLString) },
      created_at: { type: GraphQLNonNull(GraphQLString) },
      icon_url: { type: GraphQLNonNull(GraphQLString) },
      id: { type: GraphQLNonNull(GraphQLString) },
      updated: { type: GraphQLNonNull(GraphQLString) },
      url: { type: GraphQLNonNull(GraphQLString) },
      value: { type: GraphQLNonNull(GraphQLString) }
    };
  }
});

var root = new GraphQLObjectType({
  name: "QueryRoot",
  description: "Gets a random joke by from any catgory",
  fields: () => ({
    joke: {
      type: JokeType,
      description: "A joke",
      resolve: async () => {
        return await getJokeAtRandom();
      }
    },
    jokeByCat: {
      type: JokeType,
      description: "A joke",
      args: {
        category: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        return await getJokeAtRandomFromCat(args.category);
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: root
});
app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    graphiql: true
  })
);

var server = app.listen(8090, function() {});

async function getJokeAtRandom() {
  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const myJson = await response.json();
    return myJson;
  } catch (error) {
    return "Error";
  }
}
async function getJokeAtRandomFromCat(category) {
  try {
    const response = await fetch(
      "https://api.chucknorris.io/jokes/random?category=" + category
    );
    const myJson = await response.json();
    return myJson;
  } catch (error) {
    return "Error";
  }
}
