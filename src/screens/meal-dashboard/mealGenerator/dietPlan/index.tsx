// import React from "react";

// export default function DietPlanComponent({ data }) {
//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       {/* Total Macros Section */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-bold text-gray-800">Total Macros</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//           {Object.entries(data.macros).map(([key, value]) => (
//             <div key={key} className="bg-blue-100 p-4 rounded-lg text-center">
//               <p className="text-lg font-semibold capitalize">{key}</p>
//               <p className="text-xl font-bold">{value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Macros Distribution (Meals) */}
//       <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-bold text-gray-800">Meal Distribution</h2>
//         <div className="mt-4">
//           {data.macrosDistribution.map((meal, index) => (
//             <div key={index} className="border-b pb-4 mb-4">
//               <h3 className="text-lg font-bold">{meal.name}</h3>
//               <p className="text-sm text-gray-500">{meal.timing}</p>
//               <p className="text-gray-600">{meal.description}</p>
//               <div className="flex gap-4 mt-2">
//                 <p className="text-blue-500">Protein: {meal.macros.protein}g</p>
//                 <p className="text-green-500">Carbs: {meal.macros.carbs}g</p>
//                 <p className="text-yellow-500">Fat: {meal.macros.fat}g</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Meal Plan for Each Day */}
//       <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-bold text-gray-800">Meal Plan</h2>
//         {data.mealFramework.data.map((day, index) => (
//           <div key={index} className="mt-6">
//             <h3 className="text-xl font-bold text-gray-700">Day {day.day}</h3>
//             <div className="mt-2 space-y-4">
//               {day.meals.map((meal, i) => (
//                 <div key={i} className="p-4 bg-gray-100 rounded-lg shadow-sm">
//                   <h4 className="text-lg font-semibold">{meal.recipe.name}</h4>
//                   <p className="text-sm text-gray-500">{meal.time}</p>
//                   <p className="text-gray-700">{meal.recipe.description}</p>
//                   <ul className="list-disc list-inside mt-2 text-gray-600">
//                     {meal.recipe.instructions.map((instruction, idx) => (
//                       <li key={idx}>{instruction}</li>
//                     ))}
//                   </ul>
//                   <div className="mt-2">
//                     <p className="text-blue-500">Protein: {meal.recipe.nutrients.protein || 0}g</p>
//                     <p className="text-green-500">Carbs: {meal.recipe.nutrients.carbs || 0}g</p>
//                     <p className="text-yellow-500">Fat: {meal.recipe.nutrients.fat || 0}g</p>
//                     <p className="text-red-500">Calories: {meal.recipe.nutrients.calories || 0} kcal</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Shopping List */}
//       <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//           {Object.values(data.mealFramework.shopping_list).map((item, index) => (
//             <div key={index} className="bg-green-100 p-4 rounded-lg text-center">
//               <p className="text-lg font-semibold">{item.name}</p>
//               <p className="text-gray-700">{item.base_amount} {item.unit}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
