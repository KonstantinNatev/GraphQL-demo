const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');
import authors from "./data/author.json";
import books from "./data/books.json";

const app = express();

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Hello',
        fields: () => ({
            message: { 
                type: GraphQLString,
                resolve: () => 'Hello Guys'
            }
        })
    })
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log('Server Running on port 5000'))