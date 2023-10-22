const express = require("express");
const app = express();
const PORT = 6969;
const { graphqlHTTP } = require("express-graphql");
// const schema = require("./Schemas/index");
const cors = require("cors");
const userData =  require("./mock_data.json");
const { GraphQLSchema,GraphQLObjectType,GraphQLInt,GraphQLString,GraphQLList ,GraphQLNonNull} = require("graphql");


const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLInt) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      books: {
        type: new GraphQLList(booktype),
        resolve: (author) => {
          return books.filter(book => book.authorId === author.id)
        }
      }
    })
  })


const userType = new GraphQLObjectType({
    name:"user",
    fields:() => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    })
})


const booktype = new GraphQLObjectType({
    name:"book",
    description:"this is book type",
    fields:{
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
              return authors.find(author => author.id === book.authorId)
            }
          }
    }
})

const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        getAllUsers:{
            type: new GraphQLList(userType),
            args:{id:{type:GraphQLInt}},
            resolve:(parent,args) => {
                return userData
            }
        },
        books: {
            type: new GraphQLList(booktype),
            description: 'List of All Books',
            resolve: () => books
          },
          authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
          },
          author:{
            type:AuthorType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent,args) => {
                return authors.find(author => author.id === args.id)
            }
          }

    }
})


const Mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        createUser:{
          type:userType,
          args:{
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
          },
          resolve(parent, args) {
            userData.push({
              id: userData.length + 1,
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              password: args.password,
            });
            return args;
          },
        }
    }
})



const schema = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation,
})
app.use("/graphql",graphqlHTTP({
    schema,
    graphiql:true
}))

// app.get("/",(req,res) => {
//     res.status(200).json(userData)
// })
app.listen(PORT, (req,res) => {
    console.log("Server running");
    console.log(res)
    // res.json(userData)
  });