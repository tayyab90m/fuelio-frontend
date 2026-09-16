import { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import {
  LayoutDashboard,
  Target,
  Salad,
  Utensils,
  Apple,
  HandPlatter,
  Boxes,
  ChevronDown,
  ChevronRight,
  PencilRuler,
  Dumbbell,
  ArrowLeft,
  Menu,
  LayoutPanelTop,
  UtensilsCrossed,
  Vegan,
  LogOut,
} from "lucide-react";

const MealDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPath = location.pathname.split("/dashboard/")[1] || "";
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigation = [
    {
      name: "Coach Dashboard",
      icon: Target,
      navigate: "coach-dashboard",
    },
    {
      name: "Meal Dashboard",
      icon: LayoutDashboard,
      navigate: "",
    },
    {
      name: "Activity Levels",
      icon: Target,
      navigate: "activity-levels",
    },
    {
      name: "Goals",
      icon: Target,
      navigate: "goals",
    },
    {
      name: "Meal Management",
      icon: Salad,
      navigate: "meal-management",
      submenu: [
        { name: "Meals", icon: UtensilsCrossed, navigate: "meal-filter" },
        { name: "Meal Types", icon: Utensils, navigate: "meal-types" },
        { name: "Recipes", icon: Vegan, navigate: "recipes" },
        { name: "Ingredients", icon: Apple, navigate: "ingredients" },
        { name: "Categories", icon: LayoutPanelTop, navigate: "categories" },
      ],
    },
    {
      name: "Units",
      icon: PencilRuler,
      navigate: "units",
    },
    {
      name: "Meal Plan Generator",
      icon: HandPlatter,
      navigate: "meal-generator",
      className: "border-t-2 border-grey-300 !rounded-none",
    },
    {
      name: "Workout Generator",
      icon: Dumbbell,
      navigate: "workout-generator",
      className: "border-t-2 border-grey-300 !rounded-none",
    },
    {
      name: "Subscriptions",
      icon: Boxes,
      navigate: "subscriptions",
    },
    {
      name: "LogOut",
      icon: LogOut,
      navigate: "/login",
    },
  ];

  const toggleSubmenu = (index: any) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  const handleClick = (item: any, index: number) => {
    if (item.name === "LogOut") {
      dispatch({type:"userLogout"});
      navigate("/login");
    } else if (item.submenu) {
      toggleSubmenu(index);
      return;
    } else {
      navigate(item.navigate);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray/50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex gap-3 cursor-pointer">
            <span onClick={() => navigate("/dashboard")}>
              <ArrowLeft />
            </span>
            <h2 className="text-lg font-semibold">Meal Generator</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item, index) => (
              <div key={item.name}>
                <button
                  onClick={() => handleClick(item, index)}
                  className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                    currentPath === item.navigate
                      ? "bg-rose-50 text-rose-700"
                      : "text-gray-600 hover:bg-gray-50"
                  } ${
                    index === navigation.length - 3
                      ? "border-t-2 border-rose-500 rounded-none"
                      : index === navigation.length - 1
                      ? ""
                      : ""
                  } `}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.submenu && (
                    <span className="ml-auto">
                      {expandedMenu === index ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </span>
                  )}
                </button>
                {item.submenu && expandedMenu === index && (
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.name}
                        onClick={() => navigate(subItem.navigate)}
                        className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                          currentPath === subItem.navigate
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <subItem.icon className="w-5 h-5 mr-3" />
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Add hamburger menu for mobile */}
        <div className="p-4 lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="py-6 px-6">
          <Card className="shadow-none border-none">
            <Outlet />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealDashboard;
