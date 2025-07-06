import React, { useState } from 'react';
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
    Box,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bolo, PaymentMethod, paymentMethods } from '../../types/Bolo';

type Props = {
    list: Bolo[];
    onUpdateBolo?: (id: string, updatedBolo: Bolo) => void;
}

export const BoloTableArea = ({ list, onUpdateBolo }: Props) => {
    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        bolo: Bolo | null;
        paid: boolean;
        paymentMethod: PaymentMethod;
    }>({
        open: false,
        bolo: null,
        paid: false,
        paymentMethod: 'cash'
    });

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
        return paid ? 'Pago' : 'Pendente';
    };

    const handleEditClick = (bolo: Bolo) => {
        setEditDialog({
            open: true,
            bolo: bolo,
            paid: bolo.paid,
            paymentMethod: Object.keys(paymentMethods).find(key =>
                paymentMethods[key as PaymentMethod] === bolo.paymentMethod
            ) as PaymentMethod || 'cash'
        });
    };

    const handleSaveEdit = () => {
        if (editDialog.bolo && onUpdateBolo) {
            const updatedBolo = {
                ...editDialog.bolo,
                paid: editDialog.paid,
                paymentMethod: paymentMethods[editDialog.paymentMethod]
            };
            onUpdateBolo(editDialog.bolo.id, updatedBolo);
            setEditDialog({ open: false, bolo: null, paid: false, paymentMethod: 'cash' });
        }
    };

    const handleCancelEdit = () => {
        setEditDialog({ open: false, bolo: null, paid: false, paymentMethod: 'cash' });
    };

    return (
        <>
            <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Controle de Bolos
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Typography variant="body2">
                        Total de Bolos: {list.length}
                    </Typography>
                    <Typography variant="body2">
                        Total Pago: {formatCurrency(list.filter(bolo => bolo.paid).reduce((sum, bolo) => sum + bolo.value, 0))}
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
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
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
                                        <TableCell>
                                            <Tooltip title="Editar pagamento">
                                                <IconButton
                                                    onClick={() => handleEditClick(bolo)}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={editDialog.open} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Editar Pagamento - {editDialog.bolo?.clientName}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Bolo:</strong> {editDialog.bolo?.flavor} - {editDialog.bolo && formatCurrency(editDialog.bolo.value)}
                        </Typography>

                        <FormControl fullWidth>
                            <InputLabel>Forma de Pagamento</InputLabel>
                            <Select
                                value={editDialog.paymentMethod}
                                label="Forma de Pagamento"
                                onChange={(e) => setEditDialog(prev => ({
                                    ...prev,
                                    paymentMethod: e.target.value as PaymentMethod
                                }))}
                            >
                                {Object.entries(paymentMethods).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={editDialog.paid}
                                    onChange={(e) => setEditDialog(prev => ({
                                        ...prev,
                                        paid: e.target.checked
                                    }))}
                                />
                            }
                            label="Pago"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelEdit}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
