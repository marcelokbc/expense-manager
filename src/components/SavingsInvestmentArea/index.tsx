import { Box, Typography, Paper } from '@mui/material';

type Props = {
    income: number;
};

export const SavingsInvestimentArea = ({ income }: Props) => {
    const expensesAllocation = income * 0.7;
    const savingsAllocation = income * 0.3;

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Área de Investimento e Poupança
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">Despesas (70%)</Typography>
                <Typography variant="h6" color="red">
                    {expensesAllocation >= 0 ? `R$ ${expensesAllocation.toFixed(2)}` : 'N/A'}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">Investimentos (30%)</Typography>
                <Typography variant="h6" color="green">
                    {savingsAllocation >= 0 ? `R$ ${savingsAllocation.toFixed(2)}` : 'N/A'}
                </Typography>
            </Box>
        </Box>
        </Paper>
    );
};