type FeatureFlagValue = boolean | string | number | object;

const DUMMY_FLAGS: Record<string, FeatureFlagValue> = {
  flag_1: true,
  flag_2: false,
};

type FeatureFlagResult = {
  key: string;
  value: FeatureFlagValue;
};

type EvaluationResponse = {
  status: number;
  body: FeatureFlagResult;
};

type BulkEvaluationResponse = {
  status: number;
  body: {
    flags: FeatureFlagResult[];
  };
};

export class FeatureFlagManager {
  evaluate(key: string, _context?: object): EvaluationResponse {
    if (key in DUMMY_FLAGS) {
      return {
        status: 200,
        body: {
          key,
          value: DUMMY_FLAGS[key]!,
        },
      };
    }

    return {
      status: 200,
      body: {
        key,
        value: false,
      },
    };
  }

  evaluateAll(_context?: object): BulkEvaluationResponse {
    return {
      status: 200,
      body: {
        flags: Object.keys(DUMMY_FLAGS)
          .map((key) => this.evaluate(key))
          .map((res) => res.body),
      },
    };
  }
}
