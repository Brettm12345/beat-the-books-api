import gql from 'graphql-tag';

interface User {
  email: string;
  phone: string;
}

export interface DeleteMeResult {
  data: {
    deleteMe: User;
  };
}

export const DELETE_ME_MUTATION = gql`
  mutation {
    deleteMe {
      email
      phone
    }
  }
`;

type AuthPayload<Key extends string> = {
  data: Record<Key, { user: User }>;
};
export type ChangePasswordResult = AuthPayload<'changePassword'>;
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation($newPassword: String!, $oldPassword: String!) {
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
      user {
        email
        phone
      }
    }
  }
`;

export type SignupResult = AuthPayload<'signup'>;
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

export type LoginResult = AuthPayload<'login'>;
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

export interface AddToCartResult {
  data: {
    addToCart: {
      price: number;
      package: {
        name: string;
      };
    };
  };
}

export const ADD_TO_CART_MUTATION = gql`
  mutation($expireAt: String!, $packageName: String!) {
    addToCart(expireAt: $expireAt, packageName: $packageName) {
      price
      package {
        name
      }
    }
  }
`;

type OrderStatus = 'SUBMITTED' | 'PAID' | 'PREPARED' | 'FAILED';
export interface CreateOrderResult {
  data: {
    createOrder: {
      status: OrderStatus;
      totalPrice: number;
    };
  };
}

export const CREATE_ORDER_MUTATION = gql`
  mutation($stripeToken: String!) {
    createOrder(stripeToken: $stripeToken) {
      status
      totalPrice
    }
  }
`;

export interface CreatePredictionResult {
  data: {
    createPrediction: {
      id: string;
    };
  };
}

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
