import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { Item } from '../../types/Item';
import { TableItem } from '../TableItem'

type Props = {
    list: Item[]
}

export const TableArea = ({ list }: Props) => {
    return (
        <Paper elevation={3} sx={{ marginTop: 2, padding: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }} width={100} >Data</TableCell>
                        <TableCell sx={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }} width={130}>Categoria</TableCell>
                        <TableCell sx={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }} >Título</TableCell>
                        <TableCell sx={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }} >Método de Pagamento</TableCell>
                        <TableCell sx={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }} width={130}>Valor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item, index) => (
                        <TableItem key={index} item={item} />
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}