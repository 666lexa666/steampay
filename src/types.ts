// types.ts

export interface PaymentData {
  steamId: string;      // Логин Steam
  amount: number;       // Сумма пополнения
  platform?: 'steam';   // Статически передаем steam
}

export interface PaymentResponse {
  success: boolean;     // Успешно ли прошло создание платежа
  qrUrl: string;        // Ссылка на QR-код
  paymentLink: string;  // Ссылка для перехода на оплату
  paymentId: string;    // ID платежа
}
