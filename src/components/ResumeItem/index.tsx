import { Box, Typography, Paper } from '@mui/material';

type Props = {
    title: string;
    value: number;
    color?: string;
};

export const ResumeItem = ({title, value, color}: Props) => {
    return (
        <Paper elevation={3} sx={{ flex: 1, margin: 1, padding: 2 }}>
            <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                <Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: color ?? 'black' }}>
                    R$ {value.toFixed(2)}
                </Typography>
            </Box>
        </Paper>
    );
}