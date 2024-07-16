import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Investment = {
    type: string;
    percentage: number;
    investmentDate: string;
    redemptionDate: string;
    forecastAmount: number;
    percentageYield: number;
}

type InvestmentTableProps = {
    investments: Investment[];
    handleRemoveInvestment: (index: number) => void;
}

const TableInvestment: React.FC<InvestmentTableProps> = ({ investments, handleRemoveInvestment }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tipo de Investimento</TableCell>
                        <TableCell>Percentual</TableCell>
                        <TableCell>Data do Investimento</TableCell>
                        <TableCell>Data de Resgate</TableCell>
                        <TableCell>Valor Previsto</TableCell>
                        <TableCell>Rendimento Percentual</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {investments.map((investment, index) => (
                        <TableRow key={index}>
                            <TableCell>{investment.type}</TableCell>
                            <TableCell>{investment.percentage}%</TableCell>
                            <TableCell>{investment.investmentDate}</TableCell>
                            <TableCell>{investment.redemptionDate}</TableCell>
                            <TableCell>R$ {investment.forecastAmount.toFixed(2)}</TableCell>
                            <TableCell>{investment.percentageYield}%</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleRemoveInvestment(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableInvestment;