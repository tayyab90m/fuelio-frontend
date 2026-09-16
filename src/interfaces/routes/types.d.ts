export interface RouteItem {
  path: string; // Path for the route
  element: React.ReactNode; // Component to render at this path
  exact?: boolean; // Optional: Exact match for the route
  children?: RouteItem[]; // Optional: Nested routes
}