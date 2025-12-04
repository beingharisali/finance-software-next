
import http from "./http";

export const fetchSales = async () => {
  const res = await http.get("/sales"); // backend /api/v1/sales
  return res.data.sales;
};

export const createSale = async (payload: any) => {
  const res = await http.post("/sales", payload);
  return res.data.sale;
};

export const updateSale = async (id: string, payload: any) => {
  const res = await http.put(`/sales/${id}`, payload);
  return res.data.sale;
};

export const deleteSale = async (id: string) => {
  const res = await http.delete(`/sales/${id}`);
  return res.data;
};
