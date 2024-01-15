import { useContext, createContext } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const UNCATEGORIZED_BUDGET_ID = 'Uncategorized';

const BudgetsContext = createContext();
export const useBudgets = () => useContext(BudgetsContext);

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage('budgets', []);
  const [expenses, setExpenses] = useLocalStorage('expenses', []);

  function getBudgetExpenses(budgetId) {
    return expenses.filter((expense) => expense.budgetId === budgetId);
  }

  function addExpense({ description, amount, budgetId }) {
    setExpenses((prevExpenses) => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }];
    });
  }
  function addBudget({ name, max }) {
    setBudgets((prevBudgets) => {
      if (prevBudgets.find((budget) => budget.name === name)) {
        return prevBudgets;
      }
      return [...prevBudgets, { id: uuidV4(), name, max }];
    });
  }

  function deleteExpense({ id }) {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  }

  function deleteBudget({ id }) {
    // Transfer all expenses of deleted budget to the UNCATEGORIZED budget
    setExpenses((prevExpenses) => {
      return prevExpenses.map((expense) => {
        if (expense.budgetId !== id) return expense;
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
      });
    });
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== id)
    );
  }

  function getExpensesTotalForBudget(budgetId) {
    let total = 0;
    expenses.forEach((exp) => {
      if (exp.budgetId === budgetId) {
        total += exp.amount;
      }
    });
    return total;
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
        getExpensesTotalForBudget,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
