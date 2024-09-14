import { Item } from '../types/Item';

export const items: Item[] = [
    { date: new Date(2024, 5, 15), category: 'food', title: 'McDonalds', paymentMethod: 'credit', value: 32 },
    { date: new Date(2024, 5, 15), category: 'food', title: 'Burger King', paymentMethod: 'credit', value: 28 },
    { date: new Date(2024, 5, 16), category: 'rent', title: 'Aluguel Apt', paymentMethod: 'credit', value: 2300 },
    { date: new Date(2024, 7, 18), category: 'salary', title: 'Salário ACME', paymentMethod: 'debit', value: 4500 },
];