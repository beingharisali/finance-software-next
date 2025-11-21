import http from "./http";

export interface TransactionType {
  date: string;
  description: string;
  category: string;
  amount: number;
}

export const fetchTransactions = async (
  page: number,
  limit: number,
  category: string = "",
  startDate: string = "",
  endDate: string = ""
) => {
  let url = `/transactions?page=${page}&limit=${limit}`;
  if (category) url += `&category=${category}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;

  const res = await http.get(url);
  return res.data;
};

export const addCategory = async (categoryName: string) => {
  const res = await http.post("/transactions/add-category", { categoryName });
  return res.data;
};

export const deleteCategory = async (categoryName: string) => {
  const res = await http.delete("/transactions/delete-category", {
    data: { categoryName },
  });
  return res.data;
};
