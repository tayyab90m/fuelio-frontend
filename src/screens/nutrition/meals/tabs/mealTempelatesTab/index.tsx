import React, { useState } from "react";
import { MealTemplate } from "../../../../../interfaces/meal/mealTemplate";
// import MealsTemplateCard from "@/components/meals/MealsTempalateCard";
// import MealsTemplateCard from "../../../../../components/meals/MealsTemplateCard";
import MealsTemplateCard from "../../../../../components/meals/MealsTempalateCard";

interface MealTemplatesTabProps {
  templates: MealTemplate[]; // Expecting templates as a prop
}

const MealTemplatesTab: React.FC<MealTemplatesTabProps> = ({ templates }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState("All Goals");
  const [countryFilter, setCountryFilter] = useState("All Countries");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGoal =
      goalFilter === "All Goals" || template.targetGroup === goalFilter;
    const matchesCountry =
      countryFilter === "All Countries" ||
      template.countries?.includes(countryFilter);

    return matchesSearch && matchesGoal && matchesCountry;
  });

  return (
    <div className="p-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search meal templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option>All Goals</option>
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
            <option>Maintenance</option>
          </select>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option>All Countries</option>
            <option>Australia</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>United States</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Create Template
        </button>
      </div>

      {/* Meal Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <MealsTemplateCard key={template.name} template={template} />
          ))
        ) : (
          <p>No templates match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default MealTemplatesTab;
