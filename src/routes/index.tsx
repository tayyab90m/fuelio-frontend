import { lazy } from 'react'
import { RouteItem } from '../interfaces/routes/types';
import NewType from '../screens/nutrition/meals/new-type';
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
import { AuthWrapper, RedirectIfSignedIn, RequireRole } from './guards';
import Register from '../screens/authentication/register';

const Dashboard = lazy(() => import('../screens/dashboard'));
const Nutrition = lazy(() => import('../screens/nutrition/index'));
const MealTypes = lazy(() => import('../screens/nutrition/meals/meal-types'));
const Layout = lazy(() => import('../layout/index'));

const MealDashboard = lazy(() => import('../screens/meal-dashboard'))

const Login = lazy(() => import('../screens/authentication/login'));

export const Router: RouteItem[] = [
  {
    path: '/login',
    element: <RedirectIfSignedIn><Login /></RedirectIfSignedIn>,
  },
  {
    path: '/register',
    element: <RedirectIfSignedIn><Register /></RedirectIfSignedIn>,
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
              // Available to every signed-in user, including clients.
              {
                path: '',
                element: <RequireRole roles={['admin', 'coach', 'client']} />,
                children: [
                  { path: 'meal-generator', element: <MealGenerator /> },
                  { path: 'diet-plan', element: <DietPlan /> },
                ],
              },
              // Content management: coaches and admins only.
              {
                path: '',
                element: <RequireRole roles={['admin', 'coach']} />,
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
                  { path: 'meal-filter', element: <MealFilter /> },
                  { path: 'subscriptions', element: <Subscriptions /> },
                ],
              },
            ]
          },
        ],
      },

    ],
  },
];
