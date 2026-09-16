import { Ingredients } from "../../interfaces/meal/ingretdients";

export const ingredients: Ingredients[] = [
  {
    name: "Chicken Breast",
    category: "Protein",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    countries: ["All Countries"],
  },
  {
    name: "Brown Rice",
    category: "Carbs",
    calories: 112,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    countries: ["All Countries"],
  },
  {
    name: "Vegemite",
    category: "Spreads",
    calories: 67,
    protein: 2.4,
    carbs: 7,
    fat: 0.2,
    countries: ["Australia", "New Zealand"],
  },
];

export const recipes = [
  {
    name: "High Protein Breakfast Bowl",
    category: "Breakfast",
    servings: 1,
    prepTime: "15 mins",
    calories: 450,
    ingredients: ["Eggs", "Oats", "Greek Yogurt"],
    difficulty: "Easy",
    countries: ["All Countries"],
  },
  {
    name: "Muscle Building Stir Fry",
    category: "Main Course",
    servings: 2,
    prepTime: "25 mins",
    calories: 650,
    ingredients: ["Chicken Breast", "Brown Rice", "Mixed Vegetables"],
    difficulty: "Medium",
    countries: ["All Countries"],
  },
];

export const mealTemplates = [
  {
    name: "Weight Loss Plan A",
    meals: 5,
    calories: "1800-2000",
    macros: "40P/30C/30F",
    targetGroup: "Weight Loss",
    countries: ["All Countries"],
  },
  {
    name: "Muscle Gain Plan B",
    meals: 6,
    calories: "3000-3200",
    macros: "35P/45C/20F",
    targetGroup: "Muscle Gain",
    countries: ["All Countries"],
  },
];

