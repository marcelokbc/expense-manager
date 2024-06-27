import { Box, Typography, IconButton, Paper } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { formatCurrentMonth } from '../../helpers/dateFilter';
import { ResumeItem } from '../../components/ResumeItem';

type Props = {
    currentMonth: string;
    onMonthChange: (newMonth: string) => void;
    income: number;
    expense: number;
};

export const InfoArea = ({ currentMonth, onMonthChange, income, expense }: Props) => {
    
    const handlePrevMonth = () => {
        let [year, month] = currentMonth.split('-');
        let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        currentDate.setMonth( currentDate.getMonth() - 1 );
        onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
    };

    const handleNextMonth = () => {
        let [year, month] = currentMonth.split('-');
        let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        currentDate.setMonth( currentDate.getMonth() + 1 );
        onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
    };

    return (
        <Paper sx={{ padding: 2, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                <IconButton onClick={handlePrevMonth} sx={{ marginRight: 1 }}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6">
                    {formatCurrentMonth(currentMonth)}
                </Typography>
                <IconButton onClick={handleNextMonth} sx={{ marginLeft: 1 }}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <ResumeItem title="Receitas" value={income} />
                <ResumeItem title="Despesas" value={expense} />
                <ResumeItem title="Balanço" value={income - expense} color={(income - expense) < 0 ? 'red' : 'green'} />
            </Box>
        </Paper>
    );
};