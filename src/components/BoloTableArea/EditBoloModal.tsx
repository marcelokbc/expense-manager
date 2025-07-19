import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Bolo, PaymentMethod, paymentMethods } from '../../types/Bolo';

type EditBoloModalProps = {
    open: boolean;
    bolo: Bolo | null;
    paid: boolean;
    paymentMethod: PaymentMethod;
    editMode: 'group' | 'individual';
    selectedBoloId?: string;
    groupedBolos: any[];
    onSave: () => void;
    onCancel: () => void;
    onPaidChange: (paid: boolean) => void;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    onClientNameChange: (name: string) => void;
    onDateChange: (date: string) => void;
    onEditModeChange: (mode: 'group' | 'individual') => void;
    onSelectedBoloChange: (boloId: string) => void;
    formatCurrency: (value: number) => string;
};

export const EditBoloModal = ({
    open,
    bolo,
    paid,
    paymentMethod,
    editMode,
    selectedBoloId,
    groupedBolos,
    onSave,
    onCancel,
    onPaidChange,
    onPaymentMethodChange,
    onClientNameChange,
    onDateChange,
    onEditModeChange,
    onSelectedBoloChange,
    formatCurrency
}: EditBoloModalProps) => {
    const groupKey = bolo ? `${bolo.clientName}-${bolo.flavor}-${bolo.date.toISOString().slice(0, 10)}` : '';
    const group = groupedBolos.find(g => g.key === groupKey);

    // Formata a data para o input type="date" (YYYY-MM-DD)
    const formatDateForInput = (date: Date) => {
        return date.toISOString().slice(0, 10);
    };

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle>
                Editar Pagamento - {bolo?.clientName}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Sabor:</strong> {bolo?.flavor}
                    </Typography>

                    {/* Campo para editar nome do cliente */}
                    <TextField
                        fullWidth
                        label="Nome do Cliente"
                        value={bolo?.clientName || ''}
                        onChange={(e) => onClientNameChange(e.target.value)}
                    />

                    {/* Campo para editar data */}
                    <TextField
                        fullWidth
                        label="Data"
                        type="date"
                        value={bolo ? formatDateForInput(bolo.date) : ''}
                        onChange={(e) => onDateChange(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    {/* Mostra informações do grupo */}
                    {group && group.totalQuantity > 1 && (
                        <>
                            <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic' }}>
                                Este grupo tem {group.totalQuantity} bolos. Escolha o que deseja editar:
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Button
                                    variant={editMode === 'group' ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => onEditModeChange('group')}
                                >
                                    Todo o grupo ({group.totalQuantity} bolos)
                                </Button>
                                <Button
                                    variant={editMode === 'individual' ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => onEditModeChange('individual')}
                                >
                                    Bolo individual
                                </Button>
                            </Box>

                            {editMode === 'group' && (
                                <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
                                    ⚠️ Esta alteração será aplicada a todos os {group.totalQuantity} bolos deste grupo.
                                </Typography>
                            )}

                            {editMode === 'individual' && (
                                <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic' }}>
                                    ✅ Esta alteração será aplicada apenas ao bolo selecionado.
                                </Typography>
                            )}
                        </>
                    )}

                    {editMode === 'individual' && group && (
                        <>
                            <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic' }}>
                                ✅ Esta alteração será aplicada apenas ao bolo selecionado.
                            </Typography>

                            <FormControl fullWidth>
                                <InputLabel>Selecionar Bolo</InputLabel>
                                <Select
                                    value={selectedBoloId || ''}
                                    label="Selecionar Bolo"
                                    onChange={(e) => onSelectedBoloChange(e.target.value as string)}
                                >
                                    {group.originalBolos.map((bolo: any, index: number) => (
                                        <MenuItem key={bolo.id} value={bolo.id}>
                                            Bolo {index + 1} - {bolo.paid ? 'Pago' : 'Pendente'} - {formatCurrency(bolo.value)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}

                    <FormControl fullWidth>
                        <InputLabel>Forma de Pagamento</InputLabel>
                        <Select
                            value={paymentMethod}
                            label="Forma de Pagamento"
                            onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
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
                                checked={paid}
                                onChange={(e) => onPaidChange(e.target.checked)}
                            />
                        }
                        label="Pago"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Cancelar
                </Button>
                <Button onClick={onSave} variant="contained" color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
