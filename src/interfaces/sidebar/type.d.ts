export interface SidebarItem {
  id?: number; // Optional unique ID
  key: string; // Unique key for identification
  label: string; // Display label for the item
  path?: string; // Optional path for navigation
  children?: SidebarItem[]; // Optional nested children
  siblings?:SidebarItem[];
}