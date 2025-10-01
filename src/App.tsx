import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CssBaseline, Box, Paper, Tabs, Tab } from '@mui/material';
import { Item } from './types/Item';
import { Bolo } from './types/Bolo';
import { Investment } from './types/Investment';
import { items } from './data/items';
import { categories } from './data/categories';
import { getCurrentMonth, filterListByMonth } from './helpers/dateFilter';
import { filterBolosByMonth } from './helpers/boloFilter';
import { TableArea } from './components/TableArea';
import { InfoArea } from './components/InfoArea';
import { InputArea } from './components/InputArea';
import { SavingsInvestimentArea } from './components/SavingsInvestmentArea';
import { ExpenseChart } from './components/ExpenseChart';
import { BoloInputArea } from './components/BoloInputArea';
import { BoloTableArea } from './components/BoloTableArea';
import { BoloInfoArea } from './components/BoloInfoArea';
import './App.css';

const LOCAL_STORAGE_KEYS = 'transactions';
const LOCAL_STORAGE_BOLOS = 'bolos';
const LOCAL_STORAGE_INVESTMENTS_KEYS = 'investments';

const App = () => {
  const [list, setList] = useState<Item[]>(() => {
    const savedTransactions = localStorage.getItem(LOCAL_STORAGE_KEYS);
      if (savedTransactions) {
        const parsedTransactions: Item[] = JSON.parse(savedTransactions);
        return [...items, ...parsedTransactions.map(item => ({
          ...item,
          date: new Date(item.date)
        }))];
      } else {
        return items;
      }
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const savedInvestments = localStorage.getItem(LOCAL_STORAGE_INVESTMENTS_KEYS);
    if (savedInvestments) {
      return JSON.parse(savedInvestments);
    } else {
      return [];
    }
  });

  const [bolos, setBolos] = useState<Bolo[]>(() => {
    const savedBolos = localStorage.getItem(LOCAL_STORAGE_BOLOS);
    if (savedBolos) {
      const parsedBolos: Bolo[] = JSON.parse(savedBolos);
      // Convert date fields to Date objects
      return parsedBolos.map(bolo => ({
        ...bolo,
        date: new Date(bolo.date)
      }));
    } else {
      return [];
    }
  });

  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [filteredBolos, setFilteredBolos] = useState<Bolo[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [defaultDate, setDefaultDate] = useState('');
  const [expensePercentage, setExpensePercentage] = useState(70);
  const [categoryExpenses, setCategoryExpenses] = useState<{ [category: string]: number }>({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const savedTransactions = list.slice(items.length); // Exclude the initial items
    localStorage.setItem(LOCAL_STORAGE_KEYS, JSON.stringify(savedTransactions));
  }, [list]);

  useEffect(() => {
    // Update local storage whenever bolos changes
    localStorage.setItem(LOCAL_STORAGE_BOLOS, JSON.stringify(bolos));
  }, [bolos]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_INVESTMENTS_KEYS, JSON.stringify(investments));
  }, [investments]);

  useEffect(()=>{
    setFilteredList( filterListByMonth(list, currentMonth) );
    setFilteredBolos( filterBolosByMonth(bolos, currentMonth) );
  }, [list, bolos, currentMonth]);

  useEffect(()=>{
    let incomeCount = 0;
    let expenseCount = 0;
    let categoryTotals: { [category: string]: number } = {};

    for (let i in filteredList) {
    const item = filteredList[i];
    const categoryName = categories[item.category].title;

    if (categories[item.category].expense) {
      expenseCount += item.value;

      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0;
      }
      categoryTotals[categoryName] += item.value;
    } else {
      incomeCount += item.value;
    }
  }

    setIncome(incomeCount);
    setExpense(expenseCount);
    setCategoryExpenses(categoryTotals);
  }, [filteredList]);

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  }

  const handleAddItem = (item: Item) => {
    let newList = [...list];
    newList.push(item);
    setList(newList);
  }

  const handleAddBolo = (newBolos: Bolo[]) => {
    setBolos(prevBolos => [...prevBolos, ...newBolos]);
  }

  const handleUpdateBolo = (id: string, updatedBolo: Bolo) => {
    setBolos(prevBolos =>
      prevBolos.map(bolo =>
        bolo.id === id ? updatedBolo : bolo
      )
    );
  }

  const handleDeleteBolo = (id: string) => {
    setBolos(prevBolos =>
      prevBolos.filter(bolo => bolo.id !== id)
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Finanças" />
            <Tab label="Bolos" />
          </Tabs>

          {activeTab === 0 && (
            <>
              <ExpenseChart expensesData={categoryExpenses} />

              <InputArea onAdd={handleAddItem} defaultDate={defaultDate} />

              <SavingsInvestimentArea
                income={income}
                expensePercentage={expensePercentage}
                setExpensePercentage={setExpensePercentage}
                investments={investments}
                setInvestments={setInvestments}
              />

              <TableArea list={filteredList} />
            </>
          )}

          {activeTab === 1 && (
            <>
              <BoloInfoArea bolos={filteredBolos} currentMonth={currentMonth} />

              <BoloInputArea onAdd={handleAddBolo} defaultDate={defaultDate} />

              <BoloTableArea list={filteredBolos} allBolos={bolos} onUpdateBolo={handleUpdateBolo} onDeleteBolo={handleDeleteBolo} />
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
