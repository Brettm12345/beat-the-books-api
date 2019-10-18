export const predictionResults = /* GraphQL */ `
  fragment PredictionResults on Prediction {
    package {
      id
    }
    home {
      name
    }
    away {
      name
    }
    winner {
      name
    }
  }
`;

interface TeamName {
  name: string;
}

export interface PredictionResults
  extends Record<'home' | 'away' | 'winner', TeamName> {
  package: {
    id: string;
  };
}
