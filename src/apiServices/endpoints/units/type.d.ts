export interface Unit {
  id: string;
  name: string;
}

export interface GetAllUnitsResponse {
  data: {
    allUnits: Unit[];
  };
}

export interface CreateUnitResponse {
  data: {
    createUnit: {
      unit: Unit;
      success: boolean;
      errors: string[];
    };
  };
}

export interface UpdateUnitResponse {
  data: {
    updateUnit: {
      unit: Unit;
      errors: string[];
    };
  };
}

export interface DeleteUnitResponse {
  data: {
    deleteUnit: {
      success: boolean;
      errors: string[];
    };
  };
}

export interface CreateUnitVariable {
  name: string;
}

export interface UpdateUnitVariable {
  id: string;
  name: string;
}

// Raw shape returned by the REST backend (GET/POST/PUT /api/v1/units) - see
// fitness-dashboard-backend/src/modules/units/units.schema.ts. Only `id`/
// `name` are surfaced through the Unit type above (matching the old
// GraphQL query's field selection).
export interface RestUnit {
  id: string;
  name: string;
  short?: string | null;
  equivalentTo?: number | null;
  unitType?: string | null;
  system?: string | null;
}
