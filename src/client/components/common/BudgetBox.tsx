import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { capitalizeFirstLetter } from "../../utils/util";

const screenWidth = Dimensions.get("window").width;

interface Income {
  id: number;
  amount: number;
  created_at: string;
  email: string;
  frequency: string | null;
  recurring: boolean;
  title: string;
}
interface Expense {
  id: number;
  cost: number;
  name: string;
  category: string;
  email: string;
  created_at: string;
  transaction_date: string;
  raw_name: string;
}

interface Budget {
  id: number;
  amount: number;
  created_at: string;
  email: string;
  category: string;
}

type BudgetBoxProps = {
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
};

const categoryColours: Record<string, string> = {
  groceries: "#FF928A",
  electronics: "#FFDA8A",
  rent: "#8A9FE3",
  entertainment: "#c497f7",
  miscellanious: "#adf55f",
  internet: "#f56788",
  home: "#716ded",
};

const BudgetBox = ({ incomes, expenses, budgets }: BudgetBoxProps) => {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.cost,
    0,
  );
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  const data = budgets.map((budget) => ({
    name: capitalizeFirstLetter(budget.category),
    amount: budget.amount,
    colour: categoryColours[budget.category],
    legendFontColour: "#333",
    legendFontSize: 8,
  }));

  if (totalIncome - totalExpenses > 0)
    data.push({
      name: "Left to\nbudget",
      amount: totalIncome - totalExpenses,
      colour: "#e8f1fa",
      legendFontColour: "#333",
      legendFontSize: 8,
    });

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <PieChart
          data={data.map((d) => ({
            name: `${d.name} `,
            population: d.amount,
            color: d.colour,
            legendFontColor: d.legendFontColour,
            legendFontSize: d.legendFontSize,
          }))}
          width={screenWidth * 0.8}
          height={150}
          chartConfig={{
            backgroundColor: "#FFF",
            backgroundGradientFrom: "#FFF",
            backgroundGradientTo: "#FFF",
            color: () => "#000",
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>TOTAL EXPENSES</Text>
        <Text style={styles.totalAmount}>${totalExpenses}</Text>
        <Text style={styles.overIncome}>
          $
          {totalIncome - totalExpenses > 0
            ? `${totalIncome - totalExpenses} left to budget`
            : `${totalExpenses - totalIncome} over budget`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  chartWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    marginTop: 10,
  },
  title: {
    color: "#555",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  totalAmount: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  overIncome: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
});

export default BudgetBox;
