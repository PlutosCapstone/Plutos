import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Expense } from "../../types";
import {
  capitalizeFirstLetter,
  isWithinLastWeek,
  truncateString,
} from "../../utils/util";
import { CATEGORY_COLOURS } from "../../constants";

type ChartConfig = {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces?: number;
  color: (opacity: number) => string;
  labelColor?: (opacity: number) => string;
  barPercentage?: number;
};

interface SpendingDetailsProps {
  expenses: Expense[];
}

const SpendingDetails = ({ expenses }: SpendingDetailsProps) => {
  const screenWidth = Dimensions.get("window").width;

  const filteredExpenses = expenses.filter((expense) =>
    isWithinLastWeek(expense.transaction_date),
  );

  const expenseCategoryTotals: Record<string, number> = {};

  let totalSpent = 0;

  filteredExpenses.forEach((expense) => {
    if (!expenseCategoryTotals[expense.category]) {
      expenseCategoryTotals[expense.category] = 0;
    }
    expenseCategoryTotals[expense.category] += expense.cost;
    totalSpent += expense.cost;
  });

  const sortedCategories = Object.fromEntries(
    Object.entries(expenseCategoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
  );

  const chartData = Object.entries(sortedCategories).map(
    ([category, amount]) => ({
      category,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }),
  );

  const colourData = chartData.map((data) => {
    return () => CATEGORY_COLOURS[data.category.toLowerCase()] ?? "#dfdfdf";
  });

  const data = {
    labels: chartData.map((item) =>
      truncateString(capitalizeFirstLetter(item.category), 5),
    ),
    datasets: [
      {
        data: chartData.map((item) => item.percentage),
        colors: colourData,
      },
    ],
  };

  const chartConfig: ChartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "white",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `transparent`,
    labelColor: (opacity = 1) => `black`,
    barPercentage: 0.8, // bar width
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Spending Details</Text>
        <Text style={styles.dropdown}>Last week ▾</Text>
      </View>
      <View style={styles.container}>
        <BarChart
          data={data}
          width={screenWidth * 0.8}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero={true}
          withCustomBarColorFromData={true}
          flatColor={true}
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dropdown: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  chart: {
    marginLeft: -10,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default SpendingDetails;
