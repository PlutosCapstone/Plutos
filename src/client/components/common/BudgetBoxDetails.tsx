import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { CATEGORY_COLOURS, ICON_CATEGORY_MAPPING } from "../../constants";
import { Budget, Expense, NavigationProps } from "../../types";
import { useRoute } from "@react-navigation/native";
import CancelIcon from "../../assets/icons/CancelIcon";
import { capitalizeFirstLetter } from "../../utils/util";
import BackArrow from "../../assets/icons/BackArrow";

interface BudgetBoxDetailsProps {
  navigation: NavigationProps;
}

const BudgetBoxDetails = ({ navigation }: BudgetBoxDetailsProps) => {
  const route = useRoute();
  const { budgets, expenses } = route.params as {
    budgets: Budget[];
    expenses: Expense[];
  };

  const returnHandler = () => {
    navigation.goBack();
  };

  const [openBudgetInfo, setOpenBudgetInfo] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget>();
  const [totalRemainingBudget, setTotalRemainingBudget] = useState(0);

  const calculateRemaining = (budget: Budget) => {
    const totalExpensesForCategory = expenses.reduce((sum, expense) => {
      if (expense.category.toLowerCase() === budget.category.toLowerCase()) {
        return sum + expense.cost;
      }
      return sum;
    }, 0);
    return budget.amount - totalExpensesForCategory;
  };

  const handleOpenBudgetInfo = (budget: Budget) => {
    setCurrentBudget(budget);
    const remaining = budget.amount - calculateRemaining(budget);
    setTotalRemainingBudget(remaining);
    setOpenBudgetInfo(true);
  };

  const screenWidth = Dimensions.get("window").width;

  const renderBudgetItem = ({ item }: { item: Budget }) => {
    const remaining = calculateRemaining(item);
    const progress =
      item.amount > 0 && remaining >= 0 ? remaining / item.amount : 0;
    const IconComponent =
      ICON_CATEGORY_MAPPING[item.category] || ICON_CATEGORY_MAPPING["misc"];

    const chartData = {
      data: [progress],
    };

    return (
      <Pressable onPress={() => handleOpenBudgetInfo(item)}>
        <View style={styles.budgetCard}>
          <View
            style={{
              ...styles.iconContainer,
              backgroundColor: CATEGORY_COLOURS[item.category] || "#EAEAEA",
            }}
          >
            {IconComponent && <IconComponent size={32} />}
          </View>

          <View style={styles.details}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text
              style={{
                ...styles.amountText,
                color: remaining > 0 ? "#21A179" : "#FF5C5C",
              }}
            >
              {remaining >= 0
                ? `$${remaining.toLocaleString()} left`
                : `$${Math.abs(remaining).toLocaleString()} over limit`}
            </Text>
          </View>

          <ProgressChart
            data={chartData}
            width={screenWidth * 0.15}
            height={screenWidth * 0.15}
            strokeWidth={8}
            radius={20}
            chartConfig={{
              backgroundColor: "#F7F7F7",
              backgroundGradientFrom: "#F7F7F7",
              backgroundGradientTo: "#F7F7F7",
              decimalPlaces: 2,
              color: (opacity = 1) =>
                progress >= 0.5
                  ? `rgba(33, 161, 121, ${opacity})`
                  : `rgba(255, 92, 92, ${opacity})`,
            }}
            hideLegend={true}
          />
        </View>
      </Pressable>
    );
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    if (item.category.toLowerCase() !== currentBudget?.category.toLowerCase())
      return null;

    const IconComponent =
      ICON_CATEGORY_MAPPING[item.category.toLowerCase()] ||
      ICON_CATEGORY_MAPPING["misc"];
    return (
      <View style={styles.expenseCard}>
        <View style={styles.iconContainer}>
          {IconComponent && <IconComponent size={32} />}
        </View>

        <View style={styles.details}>
          <Text style={styles.categoryText}>{item.name}</Text>
          <Text style={styles.amountText}>{`$${item.cost.toFixed(2)}`}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBox}>
        <Pressable style={styles.backIcon} onPress={returnHandler}>
          <BackArrow size={25} />
        </Pressable>
        <Text style={styles.header}>Remaining Budget</Text>
      </View>
      <FlatList
        data={budgets}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      {openBudgetInfo && currentBudget && (
        <Modal visible={openBudgetInfo} transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.headerModal}>
                <Pressable
                  style={styles.cancelIcon}
                  onPress={() => {
                    setCurrentBudget(undefined);
                    setOpenBudgetInfo(false);
                  }}
                >
                  <CancelIcon size={30} />
                </Pressable>
                <Text style={styles.headercategory}>
                  {capitalizeFirstLetter(currentBudget?.category)}
                </Text>
              </View>

              <Text
                style={{
                  ...styles.categoryText,
                  marginBottom: 20,
                  marginTop: 10,
                }}
              >
                {`Total Expenses: $${totalRemainingBudget.toFixed(2)}`}
              </Text>
              <FlatList
                data={expenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#333",
    alignSelf: "center",
  },
  headerBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 5,
  },
  backIcon: {
    position: "absolute",
    left: 20,
  },
  list: {
    paddingBottom: 20,
  },
  budgetCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#F7F7F7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    width: "90%",
  },
  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    width: "90%",
    borderWidth: 0.5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#EAEAEA",
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  amountText: {
    fontSize: 14,
    color: "#666",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    paddingBottom: 30,
    maxHeight: "75%",
  },
  cancelIcon: {
    position: "absolute",
    left: 0,
  },
  headerModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headercategory: {
    fontWeight: "600",
    fontSize: 24,
  },
});

export default BudgetBoxDetails;
