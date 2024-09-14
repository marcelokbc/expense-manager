export type CreditCard = {
  name: string;
  closingDay: number;
  paymentDay: number;
};

export const creditCards: CreditCard[] = [
  { name: 'Nubank Ju', closingDay: 29, paymentDay: 5 },
  { name: 'Nubank Kbça', closingDay: 11, paymentDay: 18 },
  { name: 'Carrefour', closingDay: 5, paymentDay: 15 },
  { name: 'Assai', closingDay: 18, paymentDay: 25 },
];

export const getNextMonthCharge = (purchaseDate: Date, card: CreditCard) => {
    const currentMonth = purchaseDate.getMonth();
    const currentYear = purchaseDate.getFullYear();
    const invoiceCloseDay = card.closingDay; // E.g., 10th of the current month
    const paymentDueDay = card.paymentDay; // E.g., 5th of the next month

    const invoiceCloseDate = new Date(currentYear, currentMonth, invoiceCloseDay);

    // If the purchase is made after the closing date, move to the next month
    if (purchaseDate > invoiceCloseDate) {
        const nextMonth = currentMonth + 1;
        return new Date(currentYear, nextMonth, paymentDueDay);
    }

    // If the purchase is made on or before the closing date, stay in the current month
    return new Date(currentYear, currentMonth + 1, paymentDueDay);
};
