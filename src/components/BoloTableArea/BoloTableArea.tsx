import React, { useState, useMemo, useEffect } from 'react';
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
    Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bolo, PaymentMethod, paymentMethods } from '../../types/Bolo';
import { EditBoloModal } from './EditBoloModal';
import { DeleteBoloModal } from './DeleteBoloModal';
import { BoloFilters } from './BoloFilters';

type Props = {
    list: Bolo[];
    onUpdateBolo?: (id: string, updatedBolo: Bolo) => void;
    onDeleteBolo?: (id: string) => void;
}

export const BoloTableArea = ({ list, onUpdateBolo, onDeleteBolo }: Props) => {
    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        bolo: Bolo | null;
        paid: boolean;
        paymentMethod: PaymentMethod;
        editMode: 'group' | 'individual';
        selectedBoloId?: string;
    }>({
        open: false,
        bolo: null,
        paid: false,
        paymentMethod: 'cash',
        editMode: 'group'
    });

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        bolo: Bolo | null;
        deleteMode: 'group' | 'individual';
    }>({
        open: false,
        bolo: null,
        deleteMode: 'group'
    });

    const [clientFilter, setClientFilter] = useState('');
    const [showOnlyPending, setShowOnlyPending] = useState(false);

    useEffect(() => {
        // Este useEffect garante que o agrupamento seja recalculado quando a lista muda
    }, [list]);

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

    const getStatusText = (paid: boolean, paidQuantity?: number, totalQuantity?: number) => {
        if (paid) {
            return 'Pago';
        }
        if (paidQuantity !== undefined && totalQuantity !== undefined && totalQuantity > 1) {
            return `Pendente (${paidQuantity}/${totalQuantity} pagos)`;
        }
        return 'Pendente';
    };

    const handleEditClick = (bolo: Bolo) => {
        // Encontra o grupo do bolo
        const groupKey = `${bolo.clientName}-${bolo.flavor}-${bolo.date.toISOString().slice(0, 10)}`;
        const group = groupedBolos.find(g => g.key === groupKey);

        // Se o grupo tem múltiplos bolos, inicializa com o primeiro bolo
        const initialBolo = group && group.originalBolos.length > 1 ? group.originalBolos[0] : bolo;

        setEditDialog({
            open: true,
            bolo: initialBolo,
            paid: initialBolo.paid,
            paymentMethod: Object.keys(paymentMethods).find(key =>
                paymentMethods[key as PaymentMethod] === initialBolo.paymentMethod
            ) as PaymentMethod || 'cash',
            editMode: group && group.originalBolos.length > 1 ? 'group' : 'individual',
            selectedBoloId: initialBolo.id
        });
    };

    const handleSaveEdit = () => {
        if (editDialog.bolo && onUpdateBolo) {
            if (editDialog.editMode === 'individual' && editDialog.selectedBoloId) {
                // Edita apenas o bolo selecionado
                const updatedBolo = {
                    ...editDialog.bolo,
                    clientName: editDialog.bolo.clientName,
                    paid: editDialog.paid,
                    paymentMethod: paymentMethods[editDialog.paymentMethod]
                };
                onUpdateBolo(editDialog.selectedBoloId, updatedBolo);
            } else {
                // Edita todo o grupo
                // Usa o nome original do bolo para encontrar o grupo, não o nome editado
                const originalBolo = list.find(b => b.id === editDialog.bolo!.id);
                const originalGroupKey = originalBolo ? `${originalBolo.clientName}-${originalBolo.flavor}-${originalBolo.date.toISOString().slice(0, 10)}` : '';
                const group = groupedBolos.find(g => g.key === originalGroupKey);

                if (group && editDialog.bolo) {
                    // Atualiza todos os bolos do grupo com o mesmo status, forma de pagamento e nome do cliente
                    group.originalBolos.forEach(bolo => {
                        const updatedBolo = {
                            ...bolo,
                            clientName: editDialog.bolo!.clientName,
                            paid: editDialog.paid,
                            paymentMethod: paymentMethods[editDialog.paymentMethod]
                        };
                        onUpdateBolo(bolo.id, updatedBolo);
                    });
                }
            }

            setEditDialog({ open: false, bolo: null, paid: false, paymentMethod: 'cash', editMode: 'group' });
        }
    };

    const handleCancelEdit = () => {
        setEditDialog({ open: false, bolo: null, paid: false, paymentMethod: 'cash', editMode: 'group' });
    };

    const handleDeleteClick = (bolo: Bolo) => {
        // Encontra o grupo do bolo
        const groupKey = `${bolo.clientName}-${bolo.flavor}-${bolo.date.toISOString().slice(0, 10)}`;
        const group = groupedBolos.find(g => g.key === groupKey);

        setDeleteDialog({
            open: true,
            bolo: bolo,
            deleteMode: group && group.totalQuantity > 1 ? 'group' : 'individual'
        });
    };

    const handleConfirmDelete = () => {
        if (deleteDialog.bolo && onDeleteBolo) {
            if (deleteDialog.deleteMode === 'individual') {
                // Deleta apenas o bolo selecionado
                onDeleteBolo(deleteDialog.bolo.id);
            } else {
                // Deleta todo o grupo
                const groupKey = `${deleteDialog.bolo.clientName}-${deleteDialog.bolo.flavor}-${deleteDialog.bolo.date.toISOString().slice(0, 10)}`;
                const group = groupedBolos.find(g => g.key === groupKey);

                if (group) {
                    // Deleta todos os bolos do grupo
                    group.originalBolos.forEach(bolo => {
                        onDeleteBolo(bolo.id);
                    });
                }
            }

            setDeleteDialog({ open: false, bolo: null, deleteMode: 'group' });
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ open: false, bolo: null, deleteMode: 'group' });
    };

    const groupedBolos = useMemo(() => {
        const groups: { [key: string]: {
            key: string;
            date: Date;
            clientName: string;
            flavor: string;
            totalValue: number;
            totalQuantity: number;
            paidQuantity: number;
            pendingQuantity: number;
            paymentMethod: string;
            paid: boolean;
            notes?: string;
            originalBolos: Bolo[];
        }} = {};

        // Filtra a lista por nome do cliente se houver filtro
        const filteredList = clientFilter.trim()
            ? list.filter(bolo =>
                bolo.clientName.toLowerCase().includes(clientFilter.toLowerCase())
              )
            : list;

        filteredList.forEach(bolo => {
            const key = `${bolo.clientName}-${bolo.flavor}-${bolo.date.toISOString().slice(0, 10)}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    date: bolo.date,
                    clientName: bolo.clientName,
                    flavor: bolo.flavor,
                    totalValue: 0,
                    totalQuantity: 0,
                    paidQuantity: 0,
                    pendingQuantity: 0,
                    paymentMethod: bolo.paymentMethod,
                    paid: false,
                    notes: bolo.notes,
                    originalBolos: []
                };
            }
            groups[key].totalValue += bolo.value;
            groups[key].totalQuantity += 1;
            groups[key].originalBolos.push(bolo);

            // Conta bolos pagos e pendentes
            if (bolo.paid) {
                groups[key].paidQuantity += 1;
            } else {
                groups[key].pendingQuantity += 1;
            }
        });

        // Recalcula o status do grupo baseado nos bolos pendentes
        Object.values(groups).forEach(group => {
            // Se não há bolos pendentes, o grupo está totalmente pago
            group.paid = group.pendingQuantity === 0;
        });

        // Filtra grupos que têm pendências se showOnlyPending estiver ativo
        let finalGroups = Object.values(groups);
        if (showOnlyPending) {
            finalGroups = finalGroups.filter(group => group.pendingQuantity > 0);
        }

        return finalGroups.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [list, clientFilter, showOnlyPending]);

    return (
        <>
            <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
                <BoloFilters
                    clientFilter={clientFilter}
                    showOnlyPending={showOnlyPending}
                    groupedBolos={groupedBolos}
                    onClientFilterChange={setClientFilter}
                    onShowOnlyPendingChange={setShowOnlyPending}
                />

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
                    <Typography variant="body2">
                        Grupos Completamente Pagos: {groupedBolos.filter(group => group.paid).length}
                    </Typography>
                    <Typography variant="body2">
                        Grupos Parcialmente Pagos: {groupedBolos.filter(group => !group.paid && group.paidQuantity > 0).length}
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Sabor</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Forma de Pagamento</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Observações</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupedBolos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        Nenhum bolo registrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groupedBolos.map((group) => (
                                    <TableRow key={group.key}>
                                        <TableCell>{formatDate(group.date)}</TableCell>
                                        <TableCell>{group.clientName}</TableCell>
                                        <TableCell>{group.flavor}</TableCell>
                                        <TableCell>{group.totalQuantity}</TableCell>
                                        <TableCell>{formatCurrency(group.totalValue)}</TableCell>
                                        <TableCell>{group.paymentMethod}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusText(group.paid, group.paidQuantity, group.totalQuantity)}
                                                color={getStatusColor(group.paid)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {group.notes || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Editar pagamento">
                                                    <IconButton
                                                        onClick={() => handleEditClick(group.originalBolos[0])}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton
                                                        onClick={() => handleDeleteClick(group.originalBolos[0])}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <EditBoloModal
                open={editDialog.open}
                bolo={editDialog.bolo}
                paid={editDialog.paid}
                paymentMethod={editDialog.paymentMethod}
                editMode={editDialog.editMode}
                selectedBoloId={editDialog.selectedBoloId}
                groupedBolos={groupedBolos}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onPaidChange={(paid) => setEditDialog(prev => ({ ...prev, paid }))}
                onPaymentMethodChange={(method) => setEditDialog(prev => ({ ...prev, paymentMethod: method }))}
                onClientNameChange={(name) => setEditDialog(prev => ({
                    ...prev,
                    bolo: prev.bolo ? { ...prev.bolo, clientName: name } : null
                }))}
                onEditModeChange={(mode) => setEditDialog(prev => ({ ...prev, editMode: mode }))}
                onSelectedBoloChange={(boloId) => setEditDialog(prev => ({ ...prev, selectedBoloId: boloId }))}
                formatCurrency={formatCurrency}
            />

            <DeleteBoloModal
                open={deleteDialog.open}
                bolo={deleteDialog.bolo}
                deleteMode={deleteDialog.deleteMode}
                groupedBolos={groupedBolos}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                onDeleteModeChange={(mode) => setDeleteDialog(prev => ({ ...prev, deleteMode: mode }))}
                formatDate={formatDate}
            />
        </>
    );
};
