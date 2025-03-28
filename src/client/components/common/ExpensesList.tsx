import React from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Divider } from "react-native-paper";
import {
  capitalizeFirstLetter,
  formatDate,
  isWithinTimeRange,
} from "../../utils/util";
import TimeRangeDropdown from "./TimeRangeDropdown";
import { Expense, Transaction } from "../../types";
import { Swipeable } from "react-native-gesture-handler";
import ExpensesService from "../../services/expensesService";
import Toast from "react-native-toast-message";

const groupExpenseData = (expenses: any[]) => {
  const grouped = expenses.reduce(
    (
      acc: Record<string, Record<string, { total: number; data: any[] }>>,
      expense,
    ) => {
      const { transaction_date, category, cost } = expense;

      if (!acc[transaction_date]) {
        acc[transaction_date] = {};
      }

      if (!acc[transaction_date][category]) {
        acc[transaction_date][category] = { total: 0, data: [] };
      }

      // Add expense to its category for the specific date
      acc[transaction_date][category].data.push(expense);

      // Add to total cost for that category on that date
      acc[transaction_date][category].total += cost;

      return acc;
    },
    {},
  );

  return Object.keys(grouped).map((date) => ({
    [date]: grouped[date],
  }));
};

const groupTransactionData = (transactions: any[]) => {
  const grouped = transactions.reduce(
    (acc: Record<string, { data: any[] }>, transaction) => {
      const { date, store, expenses } = transaction;

      if (!acc[date]) {
        acc[date] = { data: [] };
      }

      // Add transaction to its category for the specific date
      acc[date].data.push(transaction);

      return acc;
    },
    {},
  );

  return Object.keys(grouped).map((date) => ({
    [date]: grouped[date],
  }));
};

const transformDataForSectionList = (data: any[]) => {
  return data.map((entry) => {
    const date = Object.keys(entry)[0]; // Extract the date
    const categories = entry[date]; // Get category data

    return {
      title: date,
      data: Object.keys(categories).map((category) => ({
        category,
        total: categories[category].total,
        expenses: categories[category].data,
      })),
    };
  });
};

const transformDataForSectionListTransactions = (data: any[]) => {
  return data.map((entry) => {
    const date = Object.keys(entry)[0];
    const transactions = entry[date]["data"];

    const updatedTransactions = transactions.map((transaction: any) => {
      let total = 0;
      transaction.expenses.forEach((expense: any) => {
        total += expense.cost;
      });

      return {
        ...transaction,
        total,
      };
    });

    return {
      [date]: [
        {
          transactions: updatedTransactions,
          total: updatedTransactions.reduce(
            (sum: number, t: any) => sum + t.total,
            0,
          ),
        },
      ],
    };
  });
};

type ExpensesListProps = {
  expenses: Expense[] | null;
  transactions: Transaction[] | null;
  addNewExpenseHandler: () => void;
  setTransactions: Function;
  setExpenses: Function;
};

const TransactionCard = ({
  transaction,
  addNewExpenseHandler,
  handleDeleteTransaction,
}: any) => {
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    id: number,
  ) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTransaction(id.toString())}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };
  return (
    <Swipeable
      key={transaction.id}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, transaction.id)
      }
    >
      <TouchableOpacity onPress={() => addNewExpenseHandler(transaction)}>
        <View style={styles.transactionCardContainer}>
          <Text
            style={[
              styles.expenseName,
              !transaction.store && { fontStyle: "italic" },
            ]}
          >
            {transaction.store ? transaction.store : "Untitled"}
          </Text>
          <Text style={styles.expenseAmount}>
            -${transaction.total.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};
const DateGroupList = ({
  data,
  addNewExpenseHandler,
  handleDeleteTransaction,
}: any) => {
  const date = Object.keys(data)[0];
  const transactions = data[date][0]["transactions"];

  return (
    data && (
      <View>
        <Text style={styles.header}>{formatDate(date)}</Text>

        {transactions.map((transaction: any) => {
          return (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              addNewExpenseHandler={addNewExpenseHandler}
              handleDeleteTransaction={handleDeleteTransaction}
            />
          );
        })}
      </View>
    )
  );
};

type TabButtonsProps = {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  index: number;
  text: string;
};

const TabButtons = ({
  selectedTab,
  setSelectedTab,
  index,
  text,
}: TabButtonsProps) => {
  return (
    <TouchableOpacity
      onPress={() => setSelectedTab(index)}
      style={{
        backgroundColor: selectedTab === index ? "#6A0DAD" : "#D3D3D3",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          color: selectedTab === index ? "#FFFFFF" : "#000000",
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const ExpensesList = ({
  expenses,
  transactions,
  addNewExpenseHandler,
  setTransactions,
  setExpenses,
}: ExpensesListProps) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [timeRange, setTimeRange] = React.useState("last_month");

  const filteredExpenses = expenses?.filter((expense) =>
    isWithinTimeRange(expense.transaction_date, timeRange),
  );
  const filteredTransactions = transactions?.filter((transaction) =>
    isWithinTimeRange(transaction.date, timeRange),
  );
  const groupedExpenses = groupExpenseData(filteredExpenses ?? []);
  const transFormedExpenses = transformDataForSectionList(groupedExpenses);

  const groupedTransactions = groupTransactionData(filteredTransactions ?? []);
  const transformedData =
    transformDataForSectionListTransactions(groupedTransactions);

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = transactions?.find(
      (transaction) => transaction.id == transactionId,
    );
    const expensesToDelete =
      transaction?.expenses.map((expense: Expense) => expense.id) ?? [];
    expenses =
      expenses?.filter((expense) => !expensesToDelete.includes(expense.id)) ??
      [];
    setExpenses(expenses);
    transactions =
      transactions?.filter((transaction) => transaction.id != transactionId) ??
      [];
    setTransactions(transactions);
    try {
      ExpensesService.deleteTransaction(transactionId);
      Toast.show({
        type: "success",
        text1: "Transaction successfully deleted",
        position: "bottom",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error deleting transaction",
        text2: e instanceof Error ? e.message : "Something went wrong.",
        position: "bottom",
      });
    }
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        <TabButtons
          selectedTab={selectedTab}
          setSelectedTab={handleTabChange}
          index={0}
          text="By expense"
        />
        <TabButtons
          selectedTab={selectedTab}
          setSelectedTab={handleTabChange}
          index={1}
          text="By transactions"
        />
      </View>

      <TimeRangeDropdown timeRange={timeRange} setTimeRange={setTimeRange} />

      {selectedTab === 0 && (
        <SectionList
          style={{ maxHeight: "80%", paddingBottom: "5%" }}
          sections={transFormedExpenses}
          keyExtractor={(item) => item.category}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: "#fff" }}>
              <Text style={styles.header}>{formatDate(title)}</Text>
              <Divider style={{ marginVertical: 8 }} />
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>
                {capitalizeFirstLetter(item.category)} - $
                {item.total.toFixed(2)}
              </Text>
              {item.expenses.map((expense: any) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                  <Text style={styles.expenseAmount}>
                    -${expense.cost.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
      {selectedTab === 1 && (
        <ScrollView>
          {transformedData.map((group) => (
            <DateGroupList
              key={Object.keys(group)[0]}
              data={group}
              addNewExpenseHandler={addNewExpenseHandler}
              handleDeleteTransaction={handleDeleteTransaction}
            />
          ))}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  dropdown: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  expenseName: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionCardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 12,
    marginLeft: 10,
  },
  deleteText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ExpensesList;
