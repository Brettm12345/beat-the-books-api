import gql from 'graphql-tag';

export const DELETE_ME_MUTATION = gql`
  mutation {
    deleteMe {
      email
      phone
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation($password: String!) {
    changePassword(password: $password) {
      user {
        email
        phone
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation($email: String!, $phone: String!, $password: String!) {
    signup(email: $email, phone: $phone, password: $password) {
      user {
        email
        phone
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        email
        phone
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = gql`
  mutation($expireAt: String!, $packageName: String!) {
    addToCart(expireAt: $expireAt, packageName: $packageName) {
      package {
        name
        price
      }
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation($stripeToken: String!) {
    createOrder(stripeToken: $stripeToken) {
      status
      totalPrice
    }
  }
`;

export const CREATE_PREDICTION_MUTATION = gql`
  mutation(
    $name: String!
    $packageName: String!
    $startDate: String!
    $home: String!
    $away: String!
    $winner: String!
  ) {
    createPrediction(
      name: $name
      packageName: $packageName
      startDate: $startDate
      home: $home
      away: $away
      winner: $winner
    ) {
      id
    }
  }
`;

export const UPDATE_PREDICTION_MUTATION = gql`
  mutation($id: ID!, $winner: String!) {
    updatePrediction(id: $id, winner: $winner) {
      winner {
        key
      }
    }
  }
`;
