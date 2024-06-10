const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
  type Product {
    id: ID
    category: String!
    productName: String!
    price: Int!
    colors: [String!]
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    addProduct(category: String!, productName: String!, price: Int!, colors: [String!]): Product
    updateProduct(id: ID!, category: String, productName: String, price: Int, colors: [String!]): Product
    deleteProduct(id: ID!): String
  }

  type Subscription {
    productAdded: Product
  }
`;
