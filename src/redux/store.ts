import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { blacklist, whitelist } from "./constant";
import { userReducer } from "./user/reducer";
import { mealsReducer } from "./meals/reducer";
import { goalsReducer } from "./goals/reducer";
import { ingredientReducer } from "./ingredients/reducer";
import { activityLevelReducer } from './activity/reducer';
import { cuisineReducer } from './cuisine/reducer';
import { recipeReducer } from "./recipes/reducer";
import { categoryReducer } from './categories/reducer';
import { mealFilterReducer } from "./mealFilter/reducer";
import { unitsReducer } from './units/reducer';
import questionReducer from './questionaire/reducer';
import { dietPlanReducer } from "./diet-plan/reducer";
const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        },
    };
};

const web_storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

const appReducer = combineReducers({
    userReducer,
    mealsReducer,
    goalsReducer,
    ingredientReducer,
    activityLevels: activityLevelReducer,
    cuisine: cuisineReducer,
    recipes: recipeReducer,
    categories: categoryReducer,
    mealFilter: mealFilterReducer,
    unitsReducer,
    questionReducer,
    dietPlanReducer

});

const persistConfig = {
    key: "root",
    storage: web_storage,
    whitelist,
    blacklist,
};

const rootReducer = (state?: any, action?: any) => {
    if (action.type === 'userLogout') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof appReducer>;
export const store = configureStore({
    reducer: persistedReducer,
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;