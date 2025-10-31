export interface PaymentData {
  steamLogin: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  qrUrl: string;
  paymentLink: string;
  paymentId: string;
}