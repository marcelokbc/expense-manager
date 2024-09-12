import { TableRow, TableCell, Box, Typography } from '@mui/material';
import { Item } from '../../types/Item';
import { formatDate } from '../../helpers/dateFilter';
import { categories } from '../../data/categories';

type Props = {
    item: Item
}

export const TableItem = ({ item }: Props) => {
    const rowColor = categories[item.category].expense ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)';
    
    return (
        <TableRow sx={{ backgroundColor: rowColor }}>
            <TableCell>{formatDate(item.date)}</TableCell>
            <TableCell>
                <Box 
                    sx={{ 
                        display: 'inline-block',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: categories[item.category].color,
                        color: 'dark',
                    }}
                >
                    {categories[item.category].title}
                </Box>
            </TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>
                <Typography 
                    sx={{ 
                        color: categories[item.category].expense ? 'red' : 'green',
                        fontWeight: 'bold'
                    }}
                >
                    R$ {item.value.toFixed(2)}
                </Typography>
            </TableCell>
        </TableRow>
    );
}