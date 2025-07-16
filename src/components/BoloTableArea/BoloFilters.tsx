import React from 'react';
import {
    Box,
    TextField,
    Typography,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

type BoloFiltersProps = {
    clientFilter: string;
    paymentStatusFilter: 'all' | 'paid' | 'pending';
    groupedBolos: any[];
    onClientFilterChange: (value: string) => void;
    onPaymentStatusFilterChange: (value: 'all' | 'paid' | 'pending') => void;
};

export const BoloFilters = ({
    clientFilter,
    paymentStatusFilter,
    groupedBolos,
    onClientFilterChange,
    onPaymentStatusFilterChange
}: BoloFiltersProps) => {
    return (
        <>
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
                        onChange={(e) => onClientFilterChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                        InputProps={{
                            endAdornment: clientFilter && (
                                <IconButton
                                    size="small"
                                    onClick={() => onClientFilterChange('')}
                                    sx={{ mr: -0.5 }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            )
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={paymentStatusFilter}
                            label="Status"
                            onChange={e => onPaymentStatusFilterChange(e.target.value as 'all' | 'paid' | 'pending')}
                        >
                            <MenuItem value="all">Todos</MenuItem>
                            <MenuItem value="paid">Apenas pagos</MenuItem>
                            <MenuItem value="pending">Apenas fiados</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Informações de filtro */}
            {(clientFilter || paymentStatusFilter !== 'all') && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        {clientFilter && `Mostrando ${groupedBolos.length} resultado(s) para "${clientFilter}"`}
                        {clientFilter && paymentStatusFilter !== 'all' && ' e '}
                        {paymentStatusFilter === 'pending' && 'Filtrando apenas clientes com pendências'}
                        {paymentStatusFilter === 'paid' && 'Filtrando apenas clientes pagos'}
                    </Typography>
                </Box>
            )}
        </>
    );
};
