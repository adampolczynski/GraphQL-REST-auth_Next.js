export const typeDefs = `#graphql
type SignInResponse {
  token: String
  message: String
  user: User
}
type SignUpResponse {
  message: String
}
type SignOutResponse {
  message: String
}
type User {
  _id: String!
  email: String!
  password: String!
  createdAt: String!
  updatedAt: String!
}
type Query {
  Profile: User!
  User(_id: String!): User!
}
type Mutation {
  signin(email: String!, password: String!): SignInResponse!
  signup(email: String!, password: String!): SignUpResponse!
  signout(p: String): SignOutResponse!
}
`
