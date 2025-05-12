export interface registerDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
}
export interface updateItem {
  name?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}
export interface Item {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UpdateInvoiceDto {
  clientName?: string;
  clientEmail?: string;
}
export interface createInvoiceDto {
  clientName: string;
  clientEmail: string;
  items: Item[];
}
