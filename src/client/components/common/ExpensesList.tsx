import React from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Divider } from "react-native-paper";
import { capitalizeFirstLetter, formatDate } from "../../utils/util";

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
    (acc: Record<string, { total: number; data: any[] }>, transaction) => {
      const { date, store, expenses } = transaction;

      if (!acc[date]) {
        acc[date] = { total: 0, data: [] };
      }

      // Add transaction to its category for the specific date
      acc[date].data.push(transaction);

      // Add to total cost for that category on that date
      acc[date].total += 0;

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

const transformDataForSectionList2 = (data: any[]) => {
  return data.map((entry) => {
    const date = Object.keys(entry)[0]; // Extract the date
    const transactions = entry[date]["data"]; // Get category data

    transactions.forEach((transaction) => {
      let total = 0;
      transaction["expenses"].forEach((expense) => {
        total += expense["cost"];
      });
      transaction["total"] = total;
    });
    return {
      title: date,
      data: Object.keys(transactions).map((transaction) => ({
        transactions: transactions,
        total: transactions[transaction]["total"],
      })),
    };
  });
};

type ExpensesListProps = {
  expenses: never[] | null;
  transactions: never[] | null;
  addNewExpenseHandler: () => void;
};

const TransactionCard = ({ transaction, addNewExpenseHandler }: any) => {
  return (
    <TouchableOpacity onPress={() => addNewExpenseHandler(transaction)}>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 20, // Increased padding to make it taller
          marginVertical: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.expenseName}>{transaction.store}</Text>
        <Text style={styles.expenseAmount}>
          -${transaction.total.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const DateGroupList = ({ data, addNewExpenseHandler }: any) => {
  const date = Object.keys(data)[0];
  const transactions = data[date]["data"];

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
            />
          );
        })}
      </View>
    )
  );
};

const TabButtons = ({ selectedTab, setSelectedTab, index, text }) => {
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
}: ExpensesListProps) => {
  const groupedExpenses = groupExpenseData(expenses ?? []);
  const transFormedExpenses = transformDataForSectionList(groupedExpenses);

  const groupedTransactions = groupTransactionData(transactions ?? []);
  const transFormedTransactions =
    transformDataForSectionList2(groupedTransactions);

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
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

      {selectedTab === 0 && (
        <SectionList
          style={{ maxHeight: "80%", paddingBottom: "5%" }}
          sections={transFormedExpenses}
          keyExtractor={(item) => item.category}
          renderSectionHeader={({ section: { title } }) => (
            <>
              <Text style={styles.header}>{formatDate(title)}</Text>
              <Divider style={{ marginVertical: 8 }} />
            </>
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
          {groupedTransactions.map((group) => (
            <DateGroupList
              key={Object.keys(group)[0]}
              data={group}
              addNewExpenseHandler={addNewExpenseHandler}
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
});

export default ExpensesList;
