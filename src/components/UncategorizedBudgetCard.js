import {
  UNCATEGORIZED_BUDGET_ID,
  useBudgets,
} from '../contexts/BudgetsContext';
import BudgetCard from './BudgetCard';

export default function UncategorizedBudgetCard(props) {
  const { getExpensesTotalForBudget } = useBudgets();
  const amount = getExpensesTotalForBudget(UNCATEGORIZED_BUDGET_ID);
  if (amount === 0) return null;

  return <BudgetCard amount={amount} name='Uncategorized' gray {...props} />;
}
