import { useState, useEffect } from 'react';
import { TextField, Box, IconButton, MenuItem, InputLabel, FormControl, Select, Paper, Typography, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import { Item } from '../../types/Item';
import Swal from 'sweetalert2';

import { newDateAdjusted } from '../../helpers/dateFilter';
import { creditCards, getNextMonthCharge } from '../../helpers/paymentMethod';
import { categories } from '../../data/categories';

type Props = {
    onAdd: (item: Item) => void;
    defaultDate: string;
}

export const InputArea = ({ onAdd, defaultDate }: Props) => {
    const [dateField, setDateField] = useState(defaultDate);
    const [categoryField, setCategoryField] = useState('');
    const [titleField, setTitleField] = useState('');
    const [valueField, setValueField] = useState(0);
    const [paymentMethodField, setPaymentMethodField] = useState('');

    useEffect(() => {
        setDateField(defaultDate);
    }, [defaultDate]);

    let categoryKeys: string[] = Object.keys(categories).sort((a, b) => {
        if (categories[a].title < categories[b].title) return -1;
        if (categories[a].title > categories[b].title) return 1;
        return 0;
    });
    
    const handleAddEvent = () => {
        let errors: string[] = [];

        if(newDateAdjusted(dateField).getTime() === 0) {
            errors.push('Data inválida!');
        }
        if(!categoryKeys.includes(categoryField)) {
            errors.push('Categoria inválida!');
        }
        if(titleField === '') {
            errors.push('Título vazio!');
        }
        if(valueField <= 0) {
            errors.push('Valor inválido!');
        }
        if(!paymentMethodField) {
            errors.push('Método de pagamento inválido!');
        }
        if(errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao adicionar transação',
                html: errors.map(error => `<p>${error}</p>`).join('')
            });
        } else {
            const selectedCreditCard = creditCards.find(card => card.name === paymentMethodField);

            let adjustedDate = new Date(dateField);

            if (selectedCreditCard) {
                adjustedDate = getNextMonthCharge(new Date(dateField), selectedCreditCard);
                
                console.log("Original Date: ", dateField);
                console.log("Adjusted Date: ", adjustedDate);
                
                    Swal.fire({
                        icon: 'warning',
                        title: 'Atenção!',
                        html: `Essa compra no cartão <strong>${selectedCreditCard.name}</strong> será cobrada no mês <strong>${adjustedDate.toLocaleDateString()}</strong>.`
                    });
            }

            onAdd({
                date: newDateAdjusted(adjustedDate.toISOString().split('T')[0]),
                category: categoryField,
                title: titleField,
                value: valueField,
                paymentMethod: paymentMethodField
            });

            clearFields();
        }
    }

    const clearFields = () => {
        setCategoryField('');
        setTitleField('');
        setValueField(0);
        setPaymentMethodField('');
        setDateField(new Date().toISOString().split('T')[0]);
    }

    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Adicionar Nova Transação
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
            <TextField
                label="Data"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateField}
                onChange={e => setDateField(e.target.value)}
            />
            <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                    value={categoryField}
                    onChange={e => setCategoryField(e.target.value)}
                    variant="outlined"
                    fullWidth
                    label="Categoria"
                >
                    <MenuItem value="">
                        <em>Nenhuma</em>
                    </MenuItem>
                    {categoryKeys.map((key: string, index: number) => (
                        <MenuItem key={index} value={key}>{categories[key].title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                type="text"
                label="Título"
                variant="outlined"
                value={titleField}
                onChange={e => setTitleField(e.target.value)}
                fullWidth
            />
            <TextField
                type="number"
                label="Valor"
                variant="outlined"
                value={valueField}
                onChange={e => setValueField(parseFloat(e.target.value))}
                fullWidth
                sx={{ maxWidth: '150px' }} // Increase the size as desired
                />
                <FormControl fullWidth>
                    <InputLabel>Método de Pagamento</InputLabel>
                    <Select
                        value={paymentMethodField}
                        onChange={e => setPaymentMethodField(e.target.value)}
                        variant="outlined"
                        fullWidth
                        label="Método de Pagamento"
                    >
                        <MenuItem value="">
                            <em>Nenhum</em>
                        </MenuItem>
                        <MenuItem value="Nubank Ju">Nubank Ju</MenuItem>
                        <MenuItem value="Nubank Kbça">Nubank Kbça</MenuItem>
                        <MenuItem value="Carrefour">Carrefour </MenuItem>
                        <MenuItem value="Assai">Assai </MenuItem>
                        <MenuItem value="debito">Débito</MenuItem>
                        <MenuItem value="dinheiro">Dinheiro</MenuItem>
                        <MenuItem value="pix">Pix</MenuItem>
                    </Select>
                </FormControl>
            <Tooltip title="Nova Transação">
                <IconButton
                    color="primary"
                    onClick={handleAddEvent}
                    sx={{ flexShrink: 0 }}
                >
                    <AddIcon />
                </IconButton>
            </Tooltip>
        </Box>
        </Paper>
    );
}