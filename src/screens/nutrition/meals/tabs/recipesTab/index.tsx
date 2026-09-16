import React from "react";

interface RecipeCardProps {
  recipe: Recipe;
}

interface Recipe {
  name: string;
  category: string;
  difficulty: string;
  prepTime: string;
  servings: number;
  calories: number;
  ingredients: string[];
  countries: string[];
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
            <p className="text-sm text-gray-500">{recipe.category}</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            {recipe.difficulty}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {recipe.prepTime}
          </div>
          <div className="flex items-center text-sm">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {recipe.servings} servings
          </div>
          <div className="flex items-center text-sm">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            {recipe.calories} calories
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Main Ingredients</div>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="flex gap-2">
            {recipe.countries.map((country) => (
              <span
                key={country}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
              >
                {country}
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-blue-600 hover:text-blue-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button className="p-2 text-red-600 hover:text-red-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default RecipeCard;
