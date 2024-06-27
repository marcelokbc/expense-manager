import { useState } from 'react';
import { TextField, Box, IconButton, MenuItem, InputLabel, FormControl, Select, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import { Item } from '../../types/Item';

import { newDateAdjusted } from '../../helpers/dateFilter';
import { categories } from '../../data/categories';

type Props = {
    onAdd: (item: Item) => void;
}

export const InputArea = ({ onAdd }: Props) => {
    const [dateField, setDateField] = useState('');
    const [categoryField, setCategoryField] = useState('');
    const [titleField, setTitleField] = useState('');
    const [valueField, setValueField] = useState(0);

    let categoryKeys: string[] = Object.keys(categories);
    
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
        if(errors.length > 0) {
            alert(errors.join("\n"));
        } else {
            onAdd({
                date: newDateAdjusted(dateField),
                category: categoryField,
                title: titleField,
                value: valueField
            });
            clearFields();
        }
    }

    const clearFields = () => {
        setDateField('');
        setCategoryField('');
        setTitleField('');
        setValueField(0);
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
                    {categoryKeys.map((key, index) => (
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
            <IconButton
                color="primary"
                onClick={handleAddEvent}
                sx={{ flexShrink: 0 }}
            >
                <AddIcon />
            </IconButton>
        </Box>
        </Paper>
    );
            // <Grid container spacing={2}>
            //     <Grid item xs={2}>
            //         <TextField
            //             label="Data"
            //             type="date"
            //             variant="outlined"
            //             fullWidth
            //             InputLabelProps={{ shrink: true }}
            //             value={dateField}
            //             onChange={e => setDateField(e.target.value)}
            //         />
            //     </Grid>
            //     <Grid item xs={2}>
            //         <TextField
            //             label="Categoria"
            //             select
            //             variant="outlined"
            //             fullWidth
            //             value={categoryField}
            //             onChange={e => setCategoryField(e.target.value)}
            //         >
            //             <MenuItem value="">
            //                 <em>Selecione</em>
            //             </MenuItem>
            //             {categoryKeys.map((key, index) => (
            //                 <MenuItem key={index} value={key}>
            //                     {categories[key].title}
            //                 </MenuItem>
            //             ))}
            //         </TextField>
            //     </Grid>
            //     <Grid item xs={4}>
            //         <TextField
            //             label="Título"
            //             variant="outlined"
            //             fullWidth
            //             value={titleField}
            //             onChange={e => setTitleField(e.target.value)}
            //         />
            //     </Grid>
            //     <Grid item xs={1}>
            //         <TextField
            //             label="Valor"
            //             type="number"
            //             variant="outlined"
            //             fullWidth
            //             value={valueField}
            //             onChange={e => setValueField(parseFloat(e.target.value))}
            //         />
            //     </Grid>
            //     <Grid item xs={3}>
            //         <Button
            //             variant="contained"
            //             color="primary"
            //             onClick={handleAddEvent}
            //             fullWidth
            //         >
            //             Adicionar
            //         </Button>
            //     </Grid>
            // </Grid>
}