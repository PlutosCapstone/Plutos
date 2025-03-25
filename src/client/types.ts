import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  BudgetBoxDetails:
    | {
        budgets: Budget[];
        expenses: Expense[];
      }
    | undefined;
  Login: undefined;
  ResetPassword: undefined;
  Register:
    | {
        name?: string;
        email?: string;
      }
    | undefined;
  Onboarding:
    | {
        name?: string;
        email?: string;
      }
    | undefined;
  Manage:
    | {
        name?: string;
        email?: string;
        /* Some other types later when we plan to pass from onboarding to overview */
      }
    | undefined;
  Profile: undefined;
  Main: undefined;
  MyExpenses: undefined;
  NewExpense:
    | {
        transactionData?: any;
        onChange?: () => void;
      }
    | undefined;
  MyBudget: undefined;
  NewBudget: undefined;
};

export interface Budget {
  id: number;
  amount: number;
  created_at: string;
  email: string;
  category: string;
}

export interface Income {
  id: number;
  amount: number;
  created_at: string;
  email: string;
  frequency: string | null;
  recurring: boolean;
  title: string;
}

export interface Expense {
  id: number;
  cost: number;
  name: string;
  category: string;
  email: string;
  created_at: string;
  transaction_date: string;
  raw_name: string;
}

export type NavigationProps = StackNavigationProp<RootStackParamList>;
export type RouteProps = RouteProp<RootStackParamList>;
