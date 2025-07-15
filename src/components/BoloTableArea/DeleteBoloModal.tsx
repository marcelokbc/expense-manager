import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Alert
} from '@mui/material';
import { Bolo } from '../../types/Bolo';

type DeleteBoloModalProps = {
    open: boolean;
    bolo: Bolo | null;
    deleteMode: 'group' | 'individual';
    groupedBolos: any[];
    onConfirm: () => void;
    onCancel: () => void;
    onDeleteModeChange: (mode: 'group' | 'individual') => void;
    formatDate: (date: Date) => string;
};

export const DeleteBoloModal = ({
    open,
    bolo,
    deleteMode,
    groupedBolos,
    onConfirm,
    onCancel,
    onDeleteModeChange,
    formatDate
}: DeleteBoloModalProps) => {
    const groupKey = bolo ? `${bolo.clientName}-${bolo.flavor}-${bolo.date.toISOString().slice(0, 10)}` : '';
    const group = groupedBolos.find(g => g.key === groupKey);

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle>
                Confirmar Exclusão
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Alert severity="warning">
                        Esta ação não pode ser desfeita!
                    </Alert>

                    <Typography variant="body1">
                        <strong>Cliente:</strong> {bolo?.clientName}
                    </Typography>

                    <Typography variant="body1">
                        <strong>Sabor:</strong> {bolo?.flavor}
                    </Typography>

                    <Typography variant="body1">
                        <strong>Data:</strong> {bolo && formatDate(bolo.date)}
                    </Typography>

                    {/* Mostra informações do grupo */}
                    {group && group.totalQuantity > 1 && (
                        <>
                            <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic' }}>
                                Este grupo tem {group.totalQuantity} bolos. Escolha o que deseja excluir:
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Button
                                    variant={deleteMode === 'group' ? 'contained' : 'outlined'}
                                    size="small"
                                    color="error"
                                    onClick={() => onDeleteModeChange('group')}
                                >
                                    Todo o grupo ({group.totalQuantity} bolos)
                                </Button>
                                <Button
                                    variant={deleteMode === 'individual' ? 'contained' : 'outlined'}
                                    size="small"
                                    color="error"
                                    onClick={() => onDeleteModeChange('individual')}
                                >
                                    Bolo individual
                                </Button>
                            </Box>

                            {deleteMode === 'group' && (
                                <Typography variant="body2" color="error.main" sx={{ fontStyle: 'italic' }}>
                                    ⚠️ Todos os {group.totalQuantity} bolos deste grupo serão excluídos.
                                </Typography>
                            )}

                            {deleteMode === 'individual' && (
                                <Typography variant="body2" color="error.main" sx={{ fontStyle: 'italic' }}>
                                    ⚠️ Apenas o bolo selecionado será excluído.
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Cancelar
                </Button>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Excluir
                </Button>
            </DialogActions>
        </Dialog>
    );
};
