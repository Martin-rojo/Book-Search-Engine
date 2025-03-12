import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # Define Book type
  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  # Define User type
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  # Define Auth type
  type Auth {
    token: String!
    user: User
  }

  # Define BookInput type for saveBook mutation
  input BookInput {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  # Define Query type
  type Query {
    me: User
  }

  # Define Mutation type
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;