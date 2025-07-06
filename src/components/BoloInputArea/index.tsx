import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Typography,
    Paper,
    IconButton,
    Divider,
    Grid
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';
import { Bolo, PaymentMethod, paymentMethods } from '../../types/Bolo';
import { flavors } from '../../data/flavors';

type BoloItem = {
    flavor: string;
    value: number;
    quantity: number;
};

type Props = {
    onAdd: (bolos: Bolo[]) => void;
    defaultDate?: string;
}

export const BoloInputArea = ({ onAdd, defaultDate }: Props) => {
    const [date, setDate] = useState<Date | null>(defaultDate ? new Date(defaultDate) : new Date());
    const [clientName, setClientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [paid, setPaid] = useState(true);
    const [notes, setNotes] = useState('');
    const [boloItems, setBoloItems] = useState<BoloItem[]>([
        { flavor: '', value: 0, quantity: 1 }
    ]);

    const addBoloItem = () => {
        setBoloItems([...boloItems, { flavor: '', value: 0, quantity: 1 }]);
    };

    const removeBoloItem = (index: number) => {
        if (boloItems.length > 1) {
            setBoloItems(boloItems.filter((_, i) => i !== index));
        }
    };

    const updateBoloItem = (index: number, field: keyof BoloItem, value: string | number) => {
        const newItems = [...boloItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setBoloItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!date) {
            alert('Selecione uma data!');
            return;
        }

        if (!clientName.trim()) {
            alert('Digite o nome do cliente!');
            return;
        }

        // Validate all items
        for (let i = 0; i < boloItems.length; i++) {
            const item = boloItems[i];
            if (!item.flavor || item.value <= 0) {
                alert(`Preencha todos os campos obrigatórios para o item ${i + 1}!`);
                return;
            }
        }

        // Create multiple bolos
        const newBolos: Bolo[] = [];

        boloItems.forEach((item, index) => {
            for (let i = 0; i < item.quantity; i++) {
                const newBolo: Bolo = {
                    id: `${Date.now()}-${index}-${i}`,
                    date: date,
                    clientName: clientName.trim(),
                    flavor: item.flavor,
                    value: item.value,
                    paymentMethod: paymentMethods[paymentMethod],
                    paid: paid,
                    notes: notes || undefined
                };
                newBolos.push(newBolo);
            }
        });

        onAdd(newBolos);

        // Reset form
        setBoloItems([{ flavor: '', value: 0, quantity: 1 }]);
        setClientName('');
        setPaymentMethod('cash');
        setPaid(true);
        setNotes('');
    };

    const totalValue = boloItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    const totalQuantity = boloItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>
                Adicionar Bolo
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker
                                label="Data"
                                value={date}
                                onChange={(newDate: Date | null) => setDate(newDate)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Nome do Cliente"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Forma de pagamento</InputLabel>
                            <Select
                                value={paymentMethod}
                                label="Forma de pagamento"
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            >
                                {Object.entries(paymentMethods).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={paid}
                            onChange={(e) => setPaid(e.target.checked)}
                        />
                    }
                    label="Pago"
                />

                <TextField
                    fullWidth
                    label="Observações (opcional)"
                    multiline
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <Divider />

                <Typography variant="subtitle1" gutterBottom>
                    Bolos
                </Typography>

                {boloItems.map((item, index) => (
                    <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Sabor</InputLabel>
                                    <Select
                                        value={item.flavor}
                                        label="Sabor"
                                        onChange={(e) => updateBoloItem(index, 'flavor', e.target.value)}
                                    >
                                        {flavors.map((flavorOption) => (
                                            <MenuItem key={flavorOption} value={flavorOption}>
                                                {flavorOption}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Valor (R$)"
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => updateBoloItem(index, 'value', parseFloat(e.target.value) || 0)}
                                    inputProps={{ step: "0.01", min: "0" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Quantidade"
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateBoloItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                    inputProps={{ min: "1" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        onClick={addBoloItem}
                                        color="primary"
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    {boloItems.length > 1 && (
                                        <IconButton
                                            onClick={() => removeBoloItem(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6">
                        Total: {totalQuantity} bolos - {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(totalValue)}
                    </Typography>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Adicionar {totalQuantity} Bolo{totalQuantity !== 1 ? 's' : ''}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

