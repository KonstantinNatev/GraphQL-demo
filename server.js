const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString
} = require("graphql");
const {books} = require("./data/books.json");
const {authors} = require("./data/authors.json");

const app = express();

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This is author of the book",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        book: {
            type: BookType,
            resolve: (author) => {
                return books.find((book) => book.authorId === author.id);
            }
        }
    })
});

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This is represent a book by the author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: { 
            type: AuthorType,
            resolve: (book) => {
                return authors.find((author) => author.id === book.authorId);
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "",
    fields: () => ({
        book: {
            type: BookType,
            description: "Single Books",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find((book) => book.id === args.id)
        },
        books: {
            type: GraphQLList(BookType),
            description: "List of all Books",
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: "List of all Authors",
            resolve: () => authors
        }
    })
});

const schema = new GraphQLSchema ({
    query: RootQueryType
});

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log("Server Running on port 5000"));
