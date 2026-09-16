import React from "react";
import { Flame, Dumbbell, Droplet, Leaf } from "lucide-react";

export default function MacrosCard({ macros }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow mb-4 border border-gray-200 w-full mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Macronutrients</h2>
      <div className=" grid items-end gap-3 grid-cols-4">
        {/* Calories */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-100 text-orange-800 shadow-sm">
          <div className="flex items-center gap-3">
            <Flame size={24} className="text-orange-500" />
            <span className="font-medium">Calories</span>
          </div>
          <p className="font-bold">{macros?.calories} kcal</p>
        </div>

        {/* Protein */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-100 text-blue-800 shadow-sm">
          <div className="flex items-center gap-3">
            <Dumbbell size={24} className="text-blue-500" />
            <span className="font-medium">Protein</span>
          </div>
          <p className="font-bold">{macros?.protein}g</p>
        </div>

        {/* Fat */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-100 text-yellow-800 shadow-sm">
          <div className="flex items-center gap-3">
            <Droplet size={24} className="text-yellow-500" />
            <span className="font-medium">Fat</span>
          </div>
          <p className="font-bold">{macros?.fat}g</p>
        </div>

        {/* Carbs */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-100 text-green-800 shadow-sm">
          <div className="flex items-center gap-3">
            <Leaf size={24} className="text-green-500" />
            <span className="font-medium">Carbs</span>
          </div>
          <p className="font-bold">{macros?.carbs}g</p>
        </div>
      </div>
    </div>
  );
}
