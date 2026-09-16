import React, { useState } from 'react'
import IngredientsTab from './tabs/ingredientsTab';
import RecipeCard from './tabs/recipesTab';
import MealTemplatesTab from './tabs/mealTempelatesTab';
import { mealTemplates, recipes } from '../../../utils/constants/mealData';

const AllMeals: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ingredients");
  return (
    <>
      <div className="p-6 mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Meals & Recipes Management
          </h1>
          <p className="text-gray-500">
            Manage ingredients, create recipes, and configure meal planning
            rules
          </p>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Total Ingredients</div>
            <div className="text-2xl font-bold mt-1">486</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Active Recipes</div>
            <div className="text-2xl font-bold mt-1">128</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Meal Templates</div>
            <div className="text-2xl font-bold mt-1">24</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Pending Reviews</div>
            <div className="text-2xl font-bold mt-1">12</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                "Ingredients",
                "Recipes",
                "Meal Templates",
                // "Tags",
                // "Rules",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.toLowerCase()
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>


          {activeTab === "ingredients" && <IngredientsTab />}
          {activeTab === "recipes" &&
            recipes?.map((recipe) => (
              <RecipeCard key={recipe.name} recipe={recipe} />
            ))
          }
          {activeTab === "meal templates" && <MealTemplatesTab templates={mealTemplates} />}
          {/* {activeTab === "tags" && (
            <div className="p-6">
              <div className="text-center text-gray-500 py-12">
                Tags management interface coming soon...
              </div>
            </div>
          )}
          {activeTab === "rules" && (
            <div className="p-6">
              <div className="text-center text-gray-500 py-12">
                Rules configuration interface coming soon...
              </div>
            </div>
          )} */}
        </div>
      </div>
    </>

  );

}

export default AllMeals