import { lazy } from 'react'
import { RouteItem } from '../interfaces/routes/types';
import NewType from '../screens/nutrition/meals/new-type';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate } from 'react-router-dom';
import { ActivityLevelsConfig } from '../screens/meal-dashboard/activityLevelConfig';
import { GoalsConfig } from '../screens/meal-dashboard/goalConfig';
import { RecipesConfig } from '../screens/meal-dashboard/recipes';
import { IngredientsConfig } from '../screens/meal-dashboard/ingredientsManagement';
import Units from '../screens/meal-dashboard/units';
import MealGenerator from '../screens/meal-dashboard/mealGenerator';
import Subscriptions from '../screens/meal-dashboard/subscriptions';
import MealTypeLayout from '../screens/meal-dashboard/mealType';
import DashboardOverview from '../screens/meal-dashboard/overview';
import WorkoutGenerator from '../screens/meal-dashboard/workoutGenerator';
import Categories from '../screens/meal-dashboard/categories';
import { CuisineConfig } from '../screens/meal-dashboard/cuisine';
import MealFilter from '../screens/nutrition/meals/meal';
import DietPlan from '../screens/meal-dashboard/mealGenerator/result';

const Dashboard = lazy(() => import('../screens/dashboard'));
const Nutrition = lazy(() => import('../screens/nutrition/index'));
const MealTypes = lazy(() => import('../screens/nutrition/meals/meal-types'));
const Layout = lazy(() => import('../layout/index'));

const MealDashboard = lazy(() => import('../screens/meal-dashboard'))

const Login = lazy(() => import('../screens/authentication/login'));

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { userData } = useSelector((state: RootState) => state.userReducer);

  if (!userData || !userData?.user?.id) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
export const Router: RouteItem[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AuthWrapper><Layout /></AuthWrapper>,
    children: [
      {
        path: '',
        element: (
          <Nutrition />
        ),
        children: [
          {
            path: 'dashboard', element: <MealDashboard />, 
            children: [
              { path: '', element: <DashboardOverview /> },
              {
                path: 'meal-types', element: <MealTypeLayout />, children: [
                  { path: '', element: <MealTypes />, },
                  { path: 'new-type', element: <NewType />, },
                  { path: 'edit-type/:id', element: <NewType />, },
                ]
              },
              { path: 'activity-levels', element: <ActivityLevelsConfig /> },
              { path: 'coach-dashboard', exact: true, element: <Dashboard />},
              { path: 'goals', element: <GoalsConfig /> },
              { path: 'recipes', element: <RecipesConfig /> },
              { path: 'ingredients', element: <IngredientsConfig /> },
              { path: 'cuisine', element: <CuisineConfig /> },
              { path: 'categories', element: <Categories /> },
              { path: 'units', element: <Units /> },
              { path: 'workout-generator', element: <WorkoutGenerator /> },
              { path: 'meal-generator', element: <MealGenerator /> },
              { path: 'meal-filter', element: <MealFilter /> },
              { path: 'subscriptions', element: <Subscriptions /> },
              { path: 'diet-plan', element: <DietPlan /> },

            ]
          },
        ],
      },

    ],
  },
];


