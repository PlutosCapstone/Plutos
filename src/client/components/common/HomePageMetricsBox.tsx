import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import * as ProgressBar from "react-native-progress";
import { MONTHS } from "../../constants";
import { Budget, Expense, NavigationProps, RouteProps } from "../../types";

type BudgetBoxProps = {
  navigation: NavigationProps;
  route: RouteProps;
  budgets: Budget[];
  expenses: Expense[];
};

const HomePageMetricsBox = ({
  navigation,
  route,
  budgets,
  expenses,
}: BudgetBoxProps) => {
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.cost,
    0,
  );

  const progress = totalExpenses / totalBudget;
  const currentMonth = MONTHS[new Date().getMonth()];

  const navigateToBudgetDetails = () => {
    navigation.navigate("BudgetBoxDetails", {
      expenses,
      budgets,
    });
  };

  return (
    <Pressable onPress={navigateToBudgetDetails}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{`${currentMonth}'s Budget`}</Text>
          <Text
            style={styles.percentage}
          >{`${progress === Infinity ? "No Budget Set" : Math.round(progress) * 100 + "%"}`}</Text>
        </View>

        <ProgressBar.Bar
          progress={progress}
          width={null}
          color="#9E599A"
          unfilledColor="#ddd"
          borderWidth={0}
          height={10}
          borderRadius={5}
          style={styles.progressBar}
        />

        <View style={styles.details}>
          <View>
            <Text style={styles.label}>Budget:</Text>
            <Text
              style={styles.value}
            >{`$${totalBudget.toLocaleString()}`}</Text>
          </View>
          <View>
            <Text style={styles.label}>Spent:</Text>
            <Text
              style={styles.value}
            >{`$${totalExpenses.toLocaleString()}`}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  percentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  progressBar: {
    marginBottom: 15,
  },
  progress: {
    flex: 0.63, // Fill 63% of the bar
    backgroundColor: "#9E599A",
  },
  remaining: {
    flex: 0.37, // Remaining percentage
    backgroundColor: "#eee",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  warning: {
    color: "red",
    fontSize: 14,
  },
  arrow: {
    fontSize: 24,
    color: "#ccc",
  },
});

export default HomePageMetricsBox;
