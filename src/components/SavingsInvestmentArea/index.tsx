import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import TableInvestiment from '../TableInvestment';

type Investment = {
    type: string;
    percentage: number;
    investmentDate: string;
    redemptionDate: string;
    forecastAmount: number;
    percentageYield: number;
}

type Props = {
    income: number;
    expensePercentage: number;
    setExpensePercentage: (value: number) => void;
};

export const SavingsInvestimentArea = ({ income, expensePercentage: initialExpensePercentage, setExpensePercentage}: Props) => {
    
    const [expensePercentage, setExpensePercentageState] = useState(initialExpensePercentage);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [expenseError, setExpenseError] = useState('');
    const [investmentError, setInvestmentError] = useState('');

    useEffect(() => {
        let expError = '';
        let invError = '';
        const totalInvestimentPercentage = investments.reduce((acc, item) => acc + item.percentage, 0);

        if (expensePercentage + totalInvestimentPercentage > 100) {
            expError = 'A soma de despesas e investimentos não deve ser maior que 100%';
            invError = 'A soma de despesas e investimentos não deve ser maior que 100%';
        }

        if (expensePercentage < 0 || expensePercentage > 100) {
            expError = 'O percentual de despesas deve estar entre 0 e 100';
        }

        investments.forEach(inv => {
            if (inv.percentage < 0 || inv.percentage > 100) {
                invError = 'Os percentuais de investimentos devem estar entre 0 e 100';
            }
        });

        setExpenseError(expError);
        setInvestmentError(invError);

        if (expError) {
            Swal.fire({
                icon: 'error',
                title: 'Erro nas Despesas',
                text: expenseError,
            });
        }

        if (invError) {
            Swal.fire({
                icon: 'error',
                title: 'Erro nos Investimentos',
                text: investmentError,
            });
        }
    }, [expenseError, expensePercentage, investmentError, investments]);

    const handleInvestmentChange = (index: number, field: string, value: any) => {
        const newInvestments = investments.map((inv, i) =>
            i === index ? { ...inv, [field]: value } : inv
        );
        setInvestments(newInvestments);
    };

    const handleAddInvestment = () => {
        setInvestments([...investments, { type: '', percentage: 0, investmentDate: '', redemptionDate: '', forecastAmount: 0, percentageYield: 0 }]);
    };

    const handleRemoveInvestment = (index: number) => {
        const newInvestments = investments.filter((_, i) => i !== index);
        setInvestments(newInvestments);
    };

    const expensesAllocation = income * (expensePercentage / 100);
    const totalInvestmentAllocation = investments.reduce((acc, inv) => acc + income * (inv.percentage / 100), 0);

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Área de Investimento e Poupança
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center'  }}>
                    <Typography variant="subtitle1">Despesas ({expensePercentage}%)</Typography>
                    <Typography variant="h6" color="red">
                        {expensesAllocation >= 0 ? `R$ ${expensesAllocation.toFixed(2)}` : 'N/A'}
                    </Typography>    
                </Box>
                <TextField
                    label="Percentual de Despesas"
                    type="number"
                    value={expensePercentage}
                    onChange={(e) => setExpensePercentageState(parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    sx={{ width: '20%', marginTop: 1 }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 3 }}>
                {investments.map((investment, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <TextField
                                label="Tipo de Investimento"
                                variant="outlined"
                                value={investment.type}
                                onChange={(e) => handleInvestmentChange(index, 'type', e.target.value)}
                                sx={{ marginRight: 2 }}
                            />
                            <TextField
                                label="Percentual"
                                type="number"
                                value={investment.percentage}
                                onChange={(e) => handleInvestmentChange(index, 'percentage', parseInt(e.target.value))}
                                InputProps={{ inputProps: { min: 0, max: 100 } }}
                                sx={{ width: '10%', marginRight: 2 }}
                            />
                            <TextField
                                label="Data do Investimento"
                                type="date"
                                value={investment.investmentDate}
                                onChange={(e) => handleInvestmentChange(index, 'investmentDate', e.target.value)}
                                sx={{ width: '15%', marginRight: 2 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Data de Resgate"
                                type="date"
                                value={investment.redemptionDate}
                                onChange={(e) => handleInvestmentChange(index, 'redemptionDate', e.target.value)}
                                sx={{ width: '15%', marginRight: 2 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        
                            <TextField
                                label="Valor Previsto"
                                type="number"
                                value={investment.forecastAmount}
                                onChange={(e) => handleInvestmentChange(index, 'forecastAmount', parseInt(e.target.value))}
                                sx={{ width: '15%', marginRight: 2 }}
                            />
                            <TextField
                                label="Rendimento Percentual"
                                type="number"
                                value={investment.percentageYield}
                                onChange={(e) => handleInvestmentChange(index, 'percentageYield', parseInt(e.target.value))}
                                sx={{ width: '15%', marginRight: 2 }}
                            />
                            <IconButton onClick={() => handleRemoveInvestment(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
                <Button variant="contained" onClick={handleAddInvestment}>Adicionar Investimento</Button>
            </Box>
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                <Typography variant="subtitle1">Total de Investimentos</Typography>
                <Typography variant="h6" color="green">
                    {totalInvestmentAllocation >= 0 ? `R$ ${totalInvestmentAllocation.toFixed(2)}` : 'N/A'}
                </Typography>
            </Box>
            <Box sx={{ marginTop: 3 }}>
                <TableInvestiment 
                    investments={investments} 
                    handleRemoveInvestment={handleRemoveInvestment} 
                />
            </Box>
        </Paper>
    );
};
