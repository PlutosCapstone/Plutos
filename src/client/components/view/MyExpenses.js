import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import BackArrow from "../../assets/icons/BackArrow";
import AddIcon from "../../assets/icons/AddIcon";
import HorizontalRule from "../common/HorizontalRule";
import EntrySource from "../common/EntrySource";

const MyExpenses = ({ navigation }) => {
  const returnHandler = () => {
    navigation.goBack();
  };

  const addNewExpenseHandler = () => {
    // TO DO
    // navigation.navigate("NewExpense");
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerBox}>
        <Pressable style={styles.backIcon} onPress={returnHandler}>
          <BackArrow size={35} />
        </Pressable>
        <Text style={styles.title}>My Expenses</Text>
        <Pressable style={styles.addIcon} onPress={addNewExpenseHandler}>
          <AddIcon size={35} />
        </Pressable>
      </View>

      <View>
        <View style={styles.recurring}>
          <Text style={styles.sectionTitle}>November 11, 2024</Text>

          <EntrySource incomeTitle="Groceries" additionalInfo="-$52.37" />
          <EntrySource incomeTitle="Movie Tickets" additionalInfo="-$25.77" />
          <HorizontalRule />
        </View>

        <View>
          <Text style={styles.sectionTitle}>November 10, 2024</Text>

          <EntrySource incomeTitle="Lunch" additionalInfo="-$13.22" group />
          <EntrySource incomeTitle="Coffee" additionalInfo="-$4.92" group />
          <HorizontalRule />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "100%",
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
  sectionTitle: {
    fontSize: 20,
  },
  recurring: {
    marginBottom: 24,
  },
});

export default MyExpenses;