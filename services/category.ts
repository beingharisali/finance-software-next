// import http from "./http"; // ye aapka axios instance hona chahiye

// // Interface for Custom Category response
// export interface CustomCategoryResponse {
//   success: boolean;
//   msg?: string;
//   categories?: string[];
// }

// // Fetch all custom categories
// export const fetchCustomCategories = async (): Promise<CustomCategoryResponse> => {
//   try {
//     const res = await http.get("/categories/custom-categories");
//     return res.data;
//   } catch (err: any) {
//     console.error("Failed to fetch custom categories", err);
//     return { success: false, categories: [] };
//   }
// };

// // Add a new custom category
// export const addCustomCategory = async (categoryName: string): Promise<CustomCategoryResponse> => {
//   try {
//     const res = await http.post("/categories/add-category", { categoryName });
//     return res.data;
//   } catch (err: any) {
//     console.error("Failed to add custom category", err);
//     return { success: false };
//   }
// };

// // Delete a custom category
// export const deleteCustomCategory = async (categoryName: string): Promise<CustomCategoryResponse> => {
//   try {
//     const res = await http.delete("/categories/delete-category", { data: { categoryName } });
//     return res.data;
//   } catch (err: any) {
//     console.error("Failed to delete custom category", err);
//     return { success: false };
//   }
// };


import http from "./http";

export interface CategoryResponse {
  success: boolean;
  msg: string;
  categories?: string[];
}

// Fetch all custom categories
export const fetchCustomCategories = async (): Promise<CategoryResponse> => {
  const res = await http.get("/categories");
  return res.data;
};

// Add a new custom category
export const addCustomCategory = async (categoryName: string): Promise<CategoryResponse> => {
  const res = await http.post("/categories/add", { categoryName });
  return res.data;
};

// Delete a custom category
export const deleteCustomCategory = async (categoryName: string): Promise<CategoryResponse> => {
  const res = await http.delete("/categories/delete", {
    data: { categoryName },
  });
  return res.data;
};
