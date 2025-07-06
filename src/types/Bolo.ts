export type Bolo = {
    id: string;
    date: Date;
    clientName: string;
    flavor: string;
    value: number;
    paymentMethod: string;
    paid: boolean;
    notes?: string;
}

export type PaymentMethod = 'cash' | 'pix' | 'card' | 'onSale';

export const paymentMethods: { [key in PaymentMethod]: string } = {
    cash: 'Dinheiro',
    pix: 'PIX',
    card: 'Cartão',
    onSale: 'Fiado'
};
