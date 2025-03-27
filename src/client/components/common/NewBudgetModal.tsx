import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { useUser } from "../../contexts/UserContext";
import CancelIcon from "../../assets/icons/CancelIcon";
import BudgetService from "../../services/budgetService";
import { Budget } from "../../types";
import { CATEGORIES } from "../../constants";

interface NewBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  setBudgets: Function;
  currentBudget?: Budget;
}

type DropdownItem = {
  label: string;
  value: string;
};

const NewBudgetModal = ({
  visible,
  onClose,
  setBudgets,
  currentBudget,
}: NewBudgetModalProps) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (currentBudget) {
      setAmount(currentBudget.amount.toString());
      setDropdownValue(
        CATEGORIES.find(
          (data) =>
            data.label.toLowerCase() == currentBudget?.category?.toLowerCase(),
        )?.value ?? "",
      );
    }
  }, [currentBudget]);

  const dropdownChangeHandler = (item: DropdownItem) => {
    setDropdownValue(item.value);
  };

  const grabLabelFromDropdownValue = (val: string) => {
    const entry = CATEGORIES.find((entry) => entry.value === val);
    return entry ? entry.label.toLowerCase() : null;
  };

  const validationCheck = () => {
    return Number(amount) > 0;
  };

  const addBudgetHandler = async () => {
    if (!validationCheck()) return;

    setLoading(true);
    const budgetData = {
      category: grabLabelFromDropdownValue(dropdownValue),
      amount: Number(amount),
      email: user!.email,
    };

    try {
      let newBudget: Budget[] = [];
      if (currentBudget) {
        newBudget = await BudgetService.updateBudget(
          currentBudget.id,
          budgetData,
        );
        setBudgets((prevBudgets: Budget[]) => {
          const updatedBudgets = prevBudgets.filter(
            (budget) => budget.id != currentBudget.id,
          );
          updatedBudgets.push(newBudget[0]);
          return updatedBudgets;
        });
      } else {
        newBudget = await BudgetService.createBudget(budgetData);
        setBudgets((prevBudgets: Budget[]) => [...prevBudgets, newBudget[0]]);
      }

      setLoading(false);

      setAmount("");
      setDropdownValue("");
      onClose();
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Pressable style={styles.backArrow} onPress={onClose}>
                <CancelIcon size={30} />
              </Pressable>
              <Text style={styles.headercategory}>New Budget</Text>
            </View>

            <View style={styles.fieldBox}>
              <View style={styles.dropdownBox}>
                <Text style={styles.dropdownText}>Category:</Text>
                <Dropdown
                  data={CATEGORIES}
                  labelField="label"
                  valueField="value"
                  style={styles.dropdown}
                  search
                  searchPlaceholder="Category..."
                  value={dropdownValue}
                  onChange={(item) => dropdownChangeHandler(item)}
                />
              </View>
              <TextInput
                style={styles.textInput}
                onChangeText={setAmount}
                value={amount}
                placeholder="Amount ($):"
                keyboardType="numeric"
              />

              <Pressable style={styles.submit} onPress={addBudgetHandler}>
                <Text style={styles.submitText}>
                  {loading ? (
                    <ActivityIndicator />
                  ) : currentBudget ? (
                    `Update Budget`
                  ) : (
                    `Add Budget`
                  )}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backArrow: {
    position: "absolute",
    left: 0,
  },
  headercategory: {
    fontWeight: "600",
    fontSize: 24,
  },
  textInput: {
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    fontSize: 16,
  },
  fieldBox: {
    gap: 20,
  },
  submit: {
    height: 50,
    backgroundColor: "#C6FFC9",
    borderRadius: 16,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    fontWeight: "600",
    fontSize: 18,
  },
  dropdownBox: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownText: {
    padding: 12,
    fontSize: 16,
  },
  dropdown: {
    padding: 12,
    width: "70%",
  },
});

export default NewBudgetModal;
