
import http from "./http";

export interface TransactionType {
  _id: string;           
  transactionDate: string;
  transactionDescription: string;
  transactionType: string; 
  amount: number;
  sortCode?: string;
  accountNumber?: string;
  balance?: number;
}

// ---------------------- FETCH TRANSACTIONS ----------------------
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

// ---------------------- ADD CATEGORY ----------------------
export const addCategory = async (categoryName: string) => {
  const res = await http.post("/transactions/add-category", { categoryName });
  return res.data;
};

// ---------------------- DELETE CATEGORY ----------------------
export const deleteCategory = async (categoryName: string) => {
  const res = await http.delete("/transactions/delete-category", {
    data: { categoryName },
  });
  return res.data;
};

// ---------------------- UPDATE TRANSACTION CATEGORY ----------------------

export const updateTransactionCategory = async (
  transactionId: string,
  newCategory: string,
  applyToFuture: boolean = false  // new param
) => {
  const res = await http.put(`/transactions/${transactionId}/update-category`, {
    category: newCategory,
    applyToFuture,   // send this flag to backend
  });
  return res.data;
};
