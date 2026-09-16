import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Utensils, Dumbbell, AlarmClock, Drumstick, Calendar, MinusCircle, PlusCircle, Clock, ShoppingCart, List,
  BicepsFlexed,
  EggFried,
  Ham,
  Beef,
  Citrus,
  Fish
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import MacrosCard from "../macroCard";

export default function DietPlan() {
  const { data } = useSelector((state: RootState) => state.dietPlanReducer);

  // Meal icons mapped by lowercase names for flexibility
  const mealIcons = {
    breakfast: <Utensils size={28} className="text-orange-500" />,
    morningsnack: <EggFried size={28} className="text-orange-500" />,

    lunch: <Dumbbell size={28} className="text-blue-500" />,
    afternoonsnack: <Ham size={28} className="text-blue-500" />,

    dinner: <Beef size={28} className="text-purple-500" />,
    snack: <Drumstick size={28} className="text-green-500" />,
    eveningsnack: <Fish size={28} className="text-green-500" />,
    preworkoutsnack:<Citrus size={28} className="text-green-500" />
  };

  // State for expanded meals
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);

  const toggleExpand = (mealId: string) => {
    setExpandedMeals((prev) =>
      prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]
    );
  };

  return (
    <div className="min-h-screen rounded-xl">
      {/* Header */}
      <div className="bg-white p-4 mb-4 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold">Diet Plan</h2>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md">
        {/* Macros Summary */}
        <MacrosCard macros={data.macros} />

        {/* Meal Distribution Section */}
        <div className="p-6 bg-gray-100 rounded-xl mt-6">
          <h2 className="text-3xl flex gap-2 font-bold text-gray-800 mb-6">
          <BicepsFlexed size={32} className="text-indigo-600" />
            Meal Distribution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.macrosDistribution.map((meal, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    {mealIcons[meal.name.toLowerCase().replace(/[^a-z_]/g, "")]}
                    
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">{meal.name}</h3>
                    <p className="text-sm text-gray-500">{meal.timing}</p>
                  </div>
                </div>
                <p className="text-gray-600">{meal.description}</p>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1 text-center p-3 bg-blue-100 rounded-lg">
                    <p className="text-blue-600 font-semibold">Protein</p>
                    <p className="text-xl font-bold">{meal.macros.protein}g</p>
                  </div>
                  <div className="flex-1 text-center p-3 bg-green-100 rounded-lg">
                    <p className="text-green-600 font-semibold">Carbs</p>
                    <p className="text-xl font-bold">{meal.macros.carbs}g</p>
                  </div>
                  <div className="flex-1 text-center p-3 bg-yellow-100 rounded-lg">
                    <p className="text-yellow-600 font-semibold">Fat</p>
                    <p className="text-xl font-bold">{meal.macros.fat}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Meal Plan Section */}
        <div className="p-6 bg-gray-100 mt-10 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar size={32} className="text-indigo-600" /> Weekly Meal Plan
          </h2>

          <div className="space-y-8">
            {data?.mealFramework?.data.map((dayPlan) => (
              <div key={dayPlan.day} className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Day {dayPlan.day}
                </h3>

                <div className="space-y-4">
                  {dayPlan.meals.map((meal) => {
                    const mealId = `${dayPlan.day}-${meal.type}`;
                    return (
                      <div key={meal.type} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {mealIcons[meal.type.toLowerCase().replace(/[^a-z]/g, "")]}
                            <div>
                              <h4 className="text-lg font-medium text-gray-800">{meal.recipe.name}</h4>
                              <p className="text-sm text-gray-500">{meal.type.toUpperCase()} - {meal.time}</p>
                            </div>
                          </div>
                          <button
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                            onClick={() => toggleExpand(mealId)}
                          >
                            {expandedMeals.includes(mealId) ? <MinusCircle size={20} /> : <PlusCircle size={20} />}
                          </button>
                        </div>

                        {expandedMeals.includes(mealId) && (
                          <div className="mt-4 space-y-2">
                            <p className="text-gray-600">{meal.recipe.description}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock size={16} className="text-gray-500" /> {meal.recipe.prep_time} min prep, {meal.recipe.cook_time} min cook
                            </p>

                            <h5 className="text-sm font-semibold mt-2">Instructions:</h5>
                            <ul className="list-disc pl-6 text-gray-600 text-sm">
                              {meal.recipe.instructions.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>

                            <h5 className="text-sm font-semibold mt-2">Ingredients:</h5>
                            <ul className="list-disc pl-6 text-gray-600 text-sm">
                              {meal.recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                  {ingredient.base_amount} {ingredient.unit} - {ingredient.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Shopping List */}
          {data?.mealFramework?.shopping_list && (
            <div className="bg-white p-6 rounded-lg shadow-md border mt-4 max-h-64 overflow-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingCart size={32} className="text-red-600" /> 
              <span className="text-3xl font-bold text-gray-800">Shopping List</span>
            </h2>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                {Object.values(data?.mealFramework?.shopping_list).map((item) => (
                  <li key={item?.id} className="flex items-center gap-2">
                    <ShoppingCart size={20} className="text-gray-500" />
                    {item?.base_amount} {item?.unit} - {item?.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
