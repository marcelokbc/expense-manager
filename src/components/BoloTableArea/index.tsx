import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    Box
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bolo } from '../../types/Bolo';

type Props = {
    list: Bolo[];
}

export const BoloTableArea = ({ list }: Props) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date: Date) => {
        return format(date, 'dd/MM/yyyy', { locale: ptBR });
    };

    const getStatusColor = (paid: boolean) => {
        return paid ? 'success' : 'warning';
    };

    const getStatusText = (paid: boolean) => {
        return paid ? 'Paid' : 'Pending';
    };

    return (
        <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>
                Controle de Bolos
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Typography variant="body2">
                    Total Bolos: {list.length}
                </Typography>
                <Typography variant="body2">
                    Total Vendido: {formatCurrency(list.filter(bolo => bolo.paid).reduce((sum, bolo) => sum + bolo.value, 0))}
                </Typography>
                <Typography variant="body2">
                    Total Pendente: {formatCurrency(list.filter(bolo => !bolo.paid).reduce((sum, bolo) => sum + bolo.value, 0))}
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Sabor</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Forma de Pagamento</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Observações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Nenhum bolo registrado
                                </TableCell>
                            </TableRow>
                        ) : (
                            list.map((bolo) => (
                                <TableRow key={bolo.id}>
                                    <TableCell>{formatDate(bolo.date)}</TableCell>
                                    <TableCell>{bolo.clientName}</TableCell>
                                    <TableCell>{bolo.flavor}</TableCell>
                                    <TableCell>{formatCurrency(bolo.value)}</TableCell>
                                    <TableCell>{bolo.paymentMethod}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusText(bolo.paid)}
                                            color={getStatusColor(bolo.paid)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {bolo.notes || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
