import React, { useState } from "react";
import {
  Button,
  Modal,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from "react-native-element-dropdown";

interface AddExpenseModalProps {
  visible: boolean;
  onClose: VoidFunction;
  onSave: (...args: any[]) => void;
}

const AddExpenseModal = ({
  visible,
  onClose,
  onSave,
}: AddExpenseModalProps) => {
  const [category, setCategory] = useState("Groceries");
  const [rawName, setRawName] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const handleSave = () => {
    const id = uuidv4();
    const newItem = {
      id: id,
      category,
      raw_name: rawName,
      name,
      cost: Number(cost),
    };
    onSave(newItem);
    onClose();
    setRawName("");
    setName("");
    setCost("");
    setCategory("Groceries");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Item</Text>

            <Text style={styles.label}>Category:</Text>
            <Dropdown
              data={[
                { label: "Rent", value: "Rent" },
                { label: "Groceries", value: "Groceries" },
                { label: "Entertainment", value: "Entertainment" },
                { label: "Electronics", value: "Electronics" },
                { label: "Miscellaneous", value: "Miscellaneous" },
                { label: "Internet", value: "Internet" },
                { label: "Other", value: "Other" },
              ]}
              search
              searchPlaceholder={"Groceries"}
              labelField="label"
              valueField="value"
              value={category}
              onChange={(item) => setCategory(item.value)}
              style={{ minWidth: "35%", marginBottom: "5%" }}
            />

            <Text style={styles.label}>Raw Name:</Text>
            <TextInput
              style={styles.input}
              value={rawName}
              onChangeText={setRawName}
            />

            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Cost:</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={cost}
              onChangeText={setCost}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={onClose} />
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 500,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default AddExpenseModal;
