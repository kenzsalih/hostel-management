export interface Expense {
  id: string;
  date: string;
  item: string;
  quantity: number;
  unitPrice: number;
  vendor: string;
}

export interface MessCutRequest {
  id: string;
  studentName: string;
  from: string;
  to: string;
  status: "Pending" | "Approved" | "Rejected";
}
