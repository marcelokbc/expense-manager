import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CssBaseline, Box, Paper } from '@mui/material';
import { Item } from './types/Item';
import { items } from './data/items';
import { categories } from './data/categories';
import { getCurrentMonth, filterListByMonth } from './helpers/dateFilter';
import { TableArea } from './components/TableArea';
import { InfoArea } from './components/InfoArea';
import { InputArea } from './components/InputArea';
import {  SavingsInvestimentArea } from './components/SavingsInvestmentArea';

const LOCAL_STORAGE_KEYS = 'transactions';

const App = () => {
  const [list, setList] = useState<Item[]>(() => {
    const savedTransactions = localStorage.getItem(LOCAL_STORAGE_KEYS);
    if (savedTransactions) {
      const parsedTransactions: Item[] = JSON.parse(savedTransactions);
      // Convert date fields to Date objects
      return [...items, ...parsedTransactions.map(item => ({
        ...item,
        date: new Date(item.date)
      }))];
    } else {
      return items;
    }
  });
  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [defaultDate, setDefaultDate] = useState('');
  
  useEffect(() => {
    // Update local storage whenever list changes
    const savedTransactions = list.slice(items.length); // Exclude the initial items
    localStorage.setItem(LOCAL_STORAGE_KEYS, JSON.stringify(savedTransactions));
  }, [list]);

  useEffect(()=>{
    setFilteredList( filterListByMonth(list, currentMonth) );
  }, [list, currentMonth]);

  useEffect(()=>{
    let incomeCount = 0;
    let expenseCount = 0;

    for(let i in filteredList) {
      if(categories[filteredList[i].category].expense) {
        expenseCount += filteredList[i].value;
      } else {
        incomeCount += filteredList[i].value;
      }
    }

    setIncome(incomeCount);
    setExpense(expenseCount);
  }, [filteredList]);

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  }

  const handleAddItem = (item: Item) => {
    let newList = [...list];
    newList.push(item);
    setList(newList);
  }

  return (
    <Container maxWidth="lg" sx={{ marginBottom: '50px' }}> 
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: 'darkblue', height: '120px', textAlign: 'center' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" color="white" sx={{ marginTop: '40px', fontWeight: 'bold' }}>
            Gerenciador Financeiro
          </Typography>
        </Toolbar>
      </AppBar>
      <Box mt={2} sx={{ margin: 'auto', maxWidth: '1280px' }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <InfoArea 
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            income={income}
            expense={expense}
            setDefaultDate={setDefaultDate}
          />

          <InputArea onAdd={handleAddItem} defaultDate={defaultDate} />

          <SavingsInvestimentArea income={income} />

          <TableArea list={filteredList} />
        </Paper>
      </Box>
    </Container>
  );
}
      
export default App;