// src/services/sale.api.ts

import http from "./http";

export const fetchSales = async () => {
  const res = await http.get("/adminsales/all");
  return res.data.sales;
};

export const createSale = async (data: any) => {
  const res = await http.post("/adminsales/create", data);
  return res.data;
};
