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
    Checkbox,
    TextField
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bolo, PaymentMethod, paymentMethods } from '../../types/Bolo';
import { Clear as ClearIcon } from '@mui/icons-material';

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
        editMode: 'group' | 'individual';
        selectedBoloId?: string;
    }>({
        open: false,
        bolo: null,
        paid: false,
        paymentMethod: 'cash',
        editMode: 'group'
    });

    const [clientFilter, setClientFilter] = useState('');
    const [showOnlyPending, setShowOnlyPending] = useState(false);

    useEffect(() => {
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
                const originalGroupKey = `${editDialog.bolo.clientName}-${editDialog.bolo.flavor}-${editDialog.bolo.date.toISOString().slice(0, 10)}`;
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
                {/* Cabeçalho com título e campo de busca */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        Controle de Bolos
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            size="small"
                            label="Buscar por cliente"
                            placeholder="Digite o nome..."
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                            sx={{ minWidth: 250 }}
                            InputProps={{
                                endAdornment: clientFilter && (
                                    <IconButton
                                        size="small"
                                        onClick={() => setClientFilter('')}
                                        sx={{ mr: -0.5 }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                )
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showOnlyPending}
                                    onChange={(e) => setShowOnlyPending(e.target.checked)}
                                    color="warning"
                                    size="small"
                                />
                            }
                            label="Apenas fiados"
                        />
                    </Box>
                </Box>

                {/* Informações de filtro */}
                {(clientFilter || showOnlyPending) && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            {clientFilter && `Mostrando ${groupedBolos.length} resultado(s) para "${clientFilter}"`}
                            {clientFilter && showOnlyPending && ' e '}
                            {showOnlyPending && 'Filtrando apenas clientes com pendências'}
                        </Typography>
                    </Box>
                )}

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
                                            <Tooltip title="Editar pagamento">
                                                <IconButton
                                                    onClick={() => handleEditClick(group.originalBolos[0])}
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
                            <strong>Sabor:</strong> {editDialog.bolo?.flavor}
                        </Typography>

                        {/* Campo para editar nome do cliente */}
                        <TextField
                            fullWidth
                            label="Nome do Cliente"
                            value={editDialog.bolo?.clientName || ''}
                            onChange={(e) => {
                                if (editDialog.bolo) {
                                    setEditDialog(prev => ({
                                        ...prev,
                                        bolo: {
                                            ...prev.bolo!,
                                            clientName: e.target.value
                                        }
                                    }));
                                }
                            }}
                        />

                        {/* Mostra informações do grupo */}
                        {(() => {
                            const groupKey = editDialog.bolo ? `${editDialog.bolo.clientName}-${editDialog.bolo.flavor}-${editDialog.bolo.date.toISOString().slice(0, 10)}` : '';
                            const group = groupedBolos.find(g => g.key === groupKey);
                            return group && group.totalQuantity > 1 ? (
                                <>
                                    <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic' }}>
                                        Este grupo tem {group.totalQuantity} bolos. Escolha o que deseja editar:
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Button
                                            variant={editDialog.editMode === 'group' ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => setEditDialog(prev => ({ ...prev, editMode: 'group' }))}
                                        >
                                            Todo o grupo ({group.totalQuantity} bolos)
                                        </Button>
                                        <Button
                                            variant={editDialog.editMode === 'individual' ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => setEditDialog(prev => ({ ...prev, editMode: 'individual' }))}
                                        >
                                            Bolo individual
                                        </Button>
                                    </Box>

                                    {editDialog.editMode === 'group' && (
                                        <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
                                            ⚠️ Esta alteração será aplicada a todos os {group.totalQuantity} bolos deste grupo.
                                        </Typography>
                                    )}

                                    {editDialog.editMode === 'individual' && (
                                        <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic' }}>
                                            ✅ Esta alteração será aplicada apenas ao bolo selecionado.
                                        </Typography>
                                    )}
                                </>
                            ) : null;
                        })()}

                        {editDialog.editMode === 'individual' && (
                            <>
                                <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic' }}>
                                    ✅ Esta alteração será aplicada apenas ao bolo selecionado.
                                </Typography>

                                <FormControl fullWidth>
                                    <InputLabel>Selecionar Bolo</InputLabel>
                                    <Select
                                        value={editDialog.selectedBoloId || ''}
                                        label="Selecionar Bolo"
                                        onChange={(e) => {
                                            const selectedBolo = editDialog.bolo && (() => {
                                                const groupKey = `${editDialog.bolo.clientName}-${editDialog.bolo.flavor}-${editDialog.bolo.date.toISOString().slice(0, 10)}`;
                                                const group = groupedBolos.find(g => g.key === groupKey);
                                                return group?.originalBolos.find(b => b.id === e.target.value);
                                            })();

                                            if (selectedBolo) {
                                                setEditDialog(prev => ({
                                                    ...prev,
                                                    selectedBoloId: e.target.value as string,
                                                    bolo: selectedBolo,
                                                    paid: selectedBolo.paid,
                                                    paymentMethod: Object.keys(paymentMethods).find(key =>
                                                        paymentMethods[key as PaymentMethod] === selectedBolo.paymentMethod
                                                    ) as PaymentMethod || 'cash'
                                                }));
                                            }
                                        }}
                                    >
                                        {(() => {
                                            const groupKey = editDialog.bolo ? `${editDialog.bolo.clientName}-${editDialog.bolo.flavor}-${editDialog.bolo.date.toISOString().slice(0, 10)}` : '';
                                            const group = groupedBolos.find(g => g.key === groupKey);
                                            return group?.originalBolos.map((bolo, index) => (
                                                <MenuItem key={bolo.id} value={bolo.id}>
                                                    Bolo {index + 1} - {bolo.paid ? 'Pago' : 'Pendente'} - {formatCurrency(bolo.value)}
                                                </MenuItem>
                                            )) || [];
                                        })()}
                                    </Select>
                                </FormControl>
                            </>
                        )}

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
