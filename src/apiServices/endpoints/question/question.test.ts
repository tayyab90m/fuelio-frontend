import { toDietPlanData } from './index';
import type { RestSubmitAnswerResponse } from './type';

jest.mock('../../../redux/store', () => ({ store: { getState: jest.fn(), dispatch: jest.fn() } }));
jest.mock('../../methods', () => ({}));

const response: RestSubmitAnswerResponse = {
  userAnswers: { age: 30, dietaryRestrictions: ['vegan'] },
  macros: { calories: 2000, protein: 150, fat: 70, carbs: 200 },
  macrosDistribution: [],
  mealFramework: { data: [{ day: '1', meals: [] }], shopping_list: {} },
  errors: ['No meals are linked to the "Lunch" meal type, so any meal was used for it.'],
};

describe('toDietPlanData', () => {
  it('maps a backend plan onto the screen state, turning errors into warnings', () => {
    const data = toDietPlanData(response);
    expect(data.macros.calories).toBe(2000);
    expect(data.mealFramework.data).toHaveLength(1);
    expect(data.warnings).toEqual(response.errors);
    expect(data.submitAnswer).toEqual(response.userAnswers);
  });

  it('tolerates a plan with no meal framework or errors', () => {
    const data = toDietPlanData({ ...response, mealFramework: undefined as never, errors: undefined as never });
    expect(data.mealFramework).toEqual({ data: [], shopping_list: {} });
    expect(data.warnings).toEqual([]);
  });
});
