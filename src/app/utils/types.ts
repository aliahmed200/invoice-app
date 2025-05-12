export type JWTPayload = {
  id: number;
  username: string;
};

export type InvoicesForUser = {
  invoices: invoiceswithItems[];
  totalCount: number;
};

export type CreateInvoice = {
  clientName: string;
  clientEmail: string;
  items: { name: string; quantity: number; unitPrice: number }[];
};

export type InvoiceAndItems = {
  invoices: invoiceswithItems[];
  userId: string;
};

export interface invoiceswithItems {
  id: number;
  userId: number;
  clientName: string;
  clientEmail: string;
  status: string;
  totalAmount: number;
  stripeLink: string;
  createdAt: Date;
  updatedAt: Date;
  items: {
    name: string;
    id: number;
    invoiceId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}
