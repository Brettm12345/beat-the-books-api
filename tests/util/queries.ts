import gql from 'graphql-tag';

export interface MeResult {
  data: {
    me: {
      email: string;
      phone: string;
    };
  };
}

export const ME_QUERY = gql`
  query {
    me {
      email
      phone
    }
  }
`;
