import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BackArrow from "../../assets/icons/BackArrow";
import AddIcon from "../../assets/icons/AddIcon";
import ExpensesService from "../../services/expensesService";
import { NavigationProps } from "../../types";
import { useUser } from "../../contexts/UserContext";
import ExpensesList from "../common/ExpensesList";

interface MyExpensesProp {
  navigation: NavigationProps;
}

const MyExpenses = ({ navigation }: MyExpensesProp) => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const returnHandler = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const getExpenses = async () => {
      try {
        setLoading(true);
        const expenses = await ExpensesService.getUserExpenses(user?.userid);
        setExpenses(expenses);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    };
    getExpenses();
  }, [user]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactions = await ExpensesService.getUserTransactions(
          user?.userid,
        );
        setTransactions(transactions);
      } catch (error) {
        throw error;
      }
    };
    getTransactions();
  }, [user]);

  const addNewExpenseHandler = () => {
    navigation.navigate("NewExpense");
  };

  if (loading)
    return (
      <View style={styles.background}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={styles.background}>
      <View style={styles.headerBox}>
        <Pressable style={styles.backIcon} onPress={returnHandler}>
          <BackArrow size={25} />
        </Pressable>
        <Text style={styles.title}>My Expenses</Text>
        <Pressable style={styles.addIcon} onPress={addNewExpenseHandler}>
          <AddIcon size={35} />
        </Pressable>
      </View>
      {expenses.length > 0 ? (
        <ExpensesList expenses={expenses} transactions={transactions} />
      ) : (
        <Text>No Expenses</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
    rowGap: 20,
  },
  headerBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontWeight: "600",
    fontSize: 32,
  },
  backIcon: {
    position: "absolute",
    left: 0,
  },
  addIcon: {
    position: "absolute",
    right: 24,
  },
});

export default MyExpenses;
