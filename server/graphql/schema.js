import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Product {
    id: Int!
    name: String!
    description: String
    slug: String!
    variants: [Variant]
    createdAt: String
    updatedAt: String
  }

  type Variant {
    id: Int!
    productId: Int!
    isMaster: Boolean
    priceInCents: Int!
    sku: String
    barcode: String
  }

  type User {
    id: Int!
    role: String!
    firstName: String
    lastName: String
    username: String!
    email: String!
    password: String!
  }

  type MetaList {
    total: Int
    count: Int
    after: Int
    q: String
  }

  type ProductList {
    meta: MetaList
    products: [Product]
  }

  type LoginPayload {
    token: String
    currentUser: User
  }

  type Query {
    currentUser: User
    user(id: Int, email: String, username: String): User
    product(id: Int, slug: String): Product
    findProducts(query: String, after: Int, count: Int): ProductList
    allProducts: [Product]
  }

  type Mutation {
    login(usernameOrEmail: String!, password: String!): LoginPayload
    logout: Boolean
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
