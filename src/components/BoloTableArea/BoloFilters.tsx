import React from 'react';
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    IconButton
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

type BoloFiltersProps = {
    clientFilter: string;
    showOnlyPending: boolean;
    groupedBolos: any[];
    onClientFilterChange: (value: string) => void;
    onShowOnlyPendingChange: (value: boolean) => void;
};

export const BoloFilters = ({
    clientFilter,
    showOnlyPending,
    groupedBolos,
    onClientFilterChange,
    onShowOnlyPendingChange
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

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showOnlyPending}
                                onChange={(e) => onShowOnlyPendingChange(e.target.checked)}
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
        </>
    );
};
