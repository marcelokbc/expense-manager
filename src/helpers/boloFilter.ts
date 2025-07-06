import { Bolo } from '../types/Bolo';

export const filterBolosByMonth = (list: Bolo[], date: string): Bolo[] => {
    const newList: Bolo[] = [];
    const [year, month] = date.split('-');

    for (let i in list) {
        if (
            list[i].date.getFullYear() === parseInt(year) &&
            (list[i].date.getMonth() + 1) === parseInt(month)
        ) {
            newList.push(list[i]);
        }
    }

    return newList;
};
