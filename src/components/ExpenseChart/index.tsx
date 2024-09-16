import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

type Props = {
  expensesData: { [category: string]: number }
}

export const ExpenseChart = ({ expensesData }: Props) => {
  // Calculate total expenses
  const totalExpense = Object.values(expensesData).reduce((acc, value) => acc + value, 0);

  // Calculate percentages
  const data = {
    labels: Object.keys(expensesData),
    datasets: [
      {
        label: 'Despesas por Categoria',
        data: Object.values(expensesData).map(value => (value / totalExpense) * 100),
        backgroundColor: [
          '#E5536E',  // Darkened colors
          '#2E8BDA',
          '#E5B84C',
          '#3DA39C',
          '#7D4EE0',
          '#E38636',
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Chart.js options for customizing tooltips and labels
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            const value = tooltipItem.raw as number;
            return `${tooltipItem.label}: ${value.toFixed(2)}%`;
          }
        }
      },
      datalabels: {
        formatter: (value: number, context: any) => {
          return `${value.toFixed(2)}%`;
        },
        color: '#fff'
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <h2 className="chart-title">Despesas por Categoria</h2>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
