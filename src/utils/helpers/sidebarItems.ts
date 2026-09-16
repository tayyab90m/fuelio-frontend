import { SidebarItem } from "../../interfaces/sidebar/type";

export const sidebarItems:SidebarItem[] = [
  {
    id: 0,
    key: 'Nutrition',
    label: 'Nutrition',
    children: [
      {
        key: 'Meals',
        label: 'Meals',
        path: '/nutrition/meals',
        siblings: [
          {
            key: 'Types',
            label: 'Meal Types',
            path: '/nutrition/types',
          },
          {
            key: 'Categories',
            label: 'Meal Categories',
            path: '/nutrition/categories',
          },
          {
            key: 'Cuisine',
            label: 'Cuisine',
            path: '/nutrition/cuisine',
          },
        ],
      },
     
      {
        key: 'Ingredients',
        label: 'Ingredients',
        path: '/nutrition/ingredients',
        siblings: [
          {
            key: 'Group',
            label: 'Group',
            path: '/nutrition/ingredient-groups',
          },
          {
            key: 'Units',
            label: 'Units',
            path: '/nutrition/units',
          }
        ]
      },
      {
        key: 'Recipes',
        label: 'Recipes',
        path: '/nutrition/recipes',
      },
    ],
  },
  // {
  //   id: 1,
  //   key: 'Sales',
  //   label: 'Sales',
  //   children: [
  //     {
  //       key: 'Subscription',
  //       label: 'Subscription',
  //       path: '/sales/subscription',
  //     },
  //     {
  //       key: 'MealPlan',
  //       label: 'Meal Plan',
  //       path: '/sales/meal-plans',
  //     },
  //   ],
  // },
  {
    id: 2,
    key: 'Meal Generator',
    label: 'Meal Generator',
    children: [
      {
        key: 'Meal Generator Dashboard',
        label: 'Meal Dashboard',
        path: '/dashboard',
      },
    ],
  }
];
