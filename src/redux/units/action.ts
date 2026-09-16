import { 
  getAllUnits as getAllUnitsApi,
  createUnit,
  updateUnit,
  deleteUnit 
} from "../../apiServices/endpoints/units";
import { store } from "../store";
import { setUnits } from "./reducer";
import { CreateUnitVariable, UpdateUnitVariable } from "../../apiServices/endpoints/units/type";

export const onGetUnits = async (): Promise<Array<{ id: string, name: string }>> => {
  try {
      const response = await getAllUnitsApi();
      if (response?.data?.allUnits) {
          store.dispatch(setUnits(response.data.allUnits));
          return response.data.allUnits;
      }
      return [];
  } catch (error) {
      return [];
  }
}

export const onCreateUnit = async (props: CreateUnitVariable): Promise<boolean> => {
    try {
        const response = await createUnit(props);
        if (!response?.data?.createUnit?.unit) return false;
        await onGetUnits(); // Refresh units list
        return true;
    } catch (error) {
        return false;
    }
}

export const onUpdateUnit = async (props: UpdateUnitVariable): Promise<boolean> => {
    try {
        const response = await updateUnit(props);
        if (!response?.data?.updateUnit?.unit) return false;
        await onGetUnits(); // Refresh units list
        return true;
    } catch (error) {
        return false;
    }
}

export const onDeleteUnit = async (id: string): Promise<boolean> => {
    try {
        const response = await deleteUnit(id);
        if (!response?.data?.deleteUnit?.success) return false;
        await onGetUnits(); // Refresh units list
        return true;
    } catch (error) {
        return false;
    }
} 