import React from 'react';
import { Investment } from '../../types/Investment';
import { formatDate } from '../../helpers/dateFilter';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


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
                        <TableCell>Valor do Investimento</TableCell>
                        <TableCell>Data do Investimento</TableCell>
                        <TableCell>Data de Resgate</TableCell>
                        <TableCell>Valor Previsto</TableCell>
                        <TableCell>Rendimento (%)</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {investments.map((investment, index) => (
                        <TableRow key={index}>
                            <TableCell>{investment.type}</TableCell>
                            <TableCell>R$ {investment.amount.toFixed(2)}</TableCell>
                            <TableCell>{formatDate(new Date(investment.investmentDate))}</TableCell>
                            <TableCell>{formatDate(new Date(investment.redemptionDate))}</TableCell>
                            <TableCell>R$ {investment.forecastAmount.toFixed(2)}</TableCell>
                            <TableCell>{investment.percentageYield}</TableCell>
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