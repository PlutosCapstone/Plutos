import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BackArrow from "../../assets/icons/BackArrow";
import AddIcon from "../../assets/icons/AddIcon";
import HorizontalRule from "../common/HorizontalRule";
import EntrySource from "../common/EntrySource";
import { NavigationProps } from "../../types";
import IncomeService from "../../services/incomeService";
import { useUser } from "../../contexts/UserContext";

interface MyIncomeProps {
  navigation: NavigationProps;
}

interface Income {
  id: number;
  amount: number;
  created_at: string;
  email: string;
  frequency: string | null;
  recurring: boolean;
  title: string;
}

const MyIncome = ({ navigation }: MyIncomeProps) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const { user } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      const fetchIncomes = async () => {
        try {
          const data = await IncomeService.getUserIncomes(user?.email);
          setIncomes(data);
        } catch (error) {
          console.error("Failed to fetch incomes:", error);
        }
      };
      fetchIncomes();
    }, []),
  );

  const returnHandler = () => {
    navigation.goBack();
  };

  const addNewIncomeHandler = () => {
    navigation.navigate("NewIncome");
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerBox}>
        <Pressable style={styles.backIcon} onPress={returnHandler}>
          <BackArrow size={35} />
        </Pressable>
        <Text style={styles.title}>My Income</Text>
        <Pressable style={styles.addIcon} onPress={addNewIncomeHandler}>
          <AddIcon size={35} />
        </Pressable>
      </View>

      <View>
        <View style={styles.recurring}>
          <Text style={styles.sectionTitle}>Recurring</Text>
          <HorizontalRule />
          {incomes
            .filter((income) => income.recurring)
            .map((income) => (
              <React.Fragment key={income.id}>
                <EntrySource
                  description={`$${income.amount} - ${income.frequency}`}
                  additionalInfo={income.title}
                />
                <HorizontalRule />
              </React.Fragment>
            ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>History</Text>
          <HorizontalRule />
          {incomes
            .filter((income) => !income.recurring)
            .map((income) => (
              <React.Fragment key={income.id}>
                <EntrySource
                  description={`$${income.amount}${income.recurring ? " (recurring)" : ""}`}
                  additionalInfo={`${income.title} \n${new Date(income.created_at).toLocaleDateString()}`}
                />
                <HorizontalRule />
              </React.Fragment>
            ))}
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

export default MyIncome;
