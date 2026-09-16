// Cuisine interface to match the returned data structure
export interface Cuisine {
  id: string;
  name: string;
  state?: 'published' | 'unpublished'; // Optional, could be either 'published' or 'unpublished'
}

// Base response structure for handling errors
interface BaseResponse {
  errors?: string[]; // Array of error messages
}

// Variables to send with the mutation (name and state)
export interface CreateCuisineMutationVariables {
  name: string; // Cuisine name is required
  state?: 'published' | 'unpublished'; // Cuisine state is optional
}

// Response structure for the mutation result
export interface CreateCuisineMutationResponse {
  data?: {
    createCuisine?: {
      cuisine?: Cuisine; // The created cuisine object
    } & BaseResponse; // Including the errors in case of failure
  };
}

// Variables for creating a cuisine
export type CreateCuisineVariables = Omit<Cuisine, 'id'>;

// Query for fetching all cuisines
export interface GetAllCuisinesQueryResponse {
  data?: {
    allCuisines: Cuisine[];
  };
}

export interface GetAllCuisinesQueryVariables {}

// Mutation for updating a cuisine
export interface UpdateCuisineMutationVariables {
  id: string;
  name?: string;
  state?: string;
}

export interface UpdateCuisineMutationResponse {
  data?: {
    updateCuisine?: {
      cuisine?: Cuisine;
    } & BaseResponse;
  };
}

// Mutation for deleting a cuisine
export interface DeleteCuisineMutationVariables {
  id: string;
}

export interface DeleteCuisineMutationResponse {
  data?: {
    deleteCuisine?: {
      success?: boolean;
    } & BaseResponse;
  };
}

// Mutation for updating the state of a cuisine
export interface UpdateCuisineStateMutationVariables {
  id: string;
  state: 'published' | 'unpublished';
}

export interface UpdateCuisineStateMutationResponse {
  data?: {
    updateCuisine?: {
      cuisine?: Cuisine;
    } & BaseResponse;
  };
}

// Raw shape returned/accepted by the REST backend (GET/POST/PUT
// /api/v1/cuisines) - see
// fitness-dashboard-backend/src/modules/cuisines/cuisines.schema.ts.
// state: "active" | "inactive" (frontend uses "published"/"unpublished").
export interface RestCuisine {
  id: string;
  name: string;
  state: 'active' | 'inactive';
}
