import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip
} from '@mui/material';
import { Bolo } from '../../types/Bolo';

type Props = {
    bolos: Bolo[];
    currentMonth: string;
}

export const BoloInfoArea = ({ bolos, currentMonth }: Props) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const totalBolos = bolos.length;
    const totalValue = bolos.reduce((sum, bolo) => sum + bolo.value, 0);
    const totalPaid = bolos.filter(bolo => bolo.paid).reduce((sum, bolo) => sum + bolo.value, 0);
    const totalPending = bolos.filter(bolo => !bolo.paid).reduce((sum, bolo) => sum + bolo.value, 0);

    // Count most sold flavors
    const flavorsCount = bolos.reduce((acc, bolo) => {
        acc[bolo.flavor] = (acc[bolo.flavor] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const mostSoldFlavors = Object.entries(flavorsCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

    // Count top clients
    const clientsCount = bolos.reduce((acc, bolo) => {
        acc[bolo.clientName] = (acc[bolo.clientName] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const topClients = Object.entries(clientsCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

    return (
        <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>
                Estatísticas dos Bolos - {currentMonth}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography variant="h4" color="primary">
                            {totalBolos}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Total de Bolos
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography variant="h4" color="success.main">
                            {formatCurrency(totalValue)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Valor Total
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography variant="h4" color="success.main">
                            {formatCurrency(totalPaid)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Total Pago
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography variant="h4" color="warning.main">
                            {formatCurrency(totalPending)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Total Pendente
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {mostSoldFlavors.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            Sabores Mais Vendidos:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {mostSoldFlavors.map(([flavor, count]) => (
                                <Chip
                                    key={flavor}
                                    label={`${flavor} (${count})`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            ))}
                        </Box>
                    </Grid>
                )}

                {topClients.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            Principais Clientes:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {topClients.map(([client, count]) => (
                                <Chip
                                    key={client}
                                    label={`${client} (${count})`}
                                    color="secondary"
                                    variant="outlined"
                                    size="small"
                                />
                            ))}
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};
