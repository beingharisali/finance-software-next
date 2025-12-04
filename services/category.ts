
import http from "./http";

export interface CategoryResponse {
  success: boolean;
  msg: string;
  categories?: string[];
}

// ---------------------- FETCH CUSTOM CATEGORIES ----------------------
export const fetchCustomCategories = async (): Promise<CategoryResponse> => {
  const res = await http.get("/categories");
  return res.data;
};

// ---------------------- ADD CUSTOM CATEGORY ----------------------
export const addCustomCategory = async (
  categoryName: string
): Promise<CategoryResponse> => {
  const res = await http.post("/categories/add", { categoryName });
  return res.data;
};

// ---------------------- DELETE CUSTOM CATEGORY ----------------------
export const deleteCustomCategory = async (
  categoryName: string
): Promise<CategoryResponse> => {
  const res = await http.delete("/categories/delete", {
    data: { categoryName },
  });
  return res.data;
};

// ---------------------- UPDATE CUSTOM CATEGORY ----------------------
export const updateCustomCategory = async (
  oldCategoryName: string,
  newCategoryName: string
): Promise<CategoryResponse> => {
  const res = await http.put("/categories/update", {
    oldCategoryName,
    newCategoryName,
  });
  return res.data;
};
