import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CameraIcon from "../../assets/icons/CameraIcon";
import PhotoLibraryIcon from "../../assets/icons/PhotoLibraryIcon";
import AddCircleIcon from "../../assets/icons/AddCircleIcon";
import PersonIcon from "../../assets/icons/PersonIcon";
import PeopleIcon from "../../assets/icons/PeopleIcon";
import StatsChartOutlineIcon from "../../assets/icons/StatsChartOutlineIcon";

import AddExpenseModal from "./AddExpenseModal";
import DisplayExpenseItems from "./DisplayExpenseItem";
import * as ImagePicker from "expo-image-picker";
import ExpensesService from "../../services/expensesService";

const AddExpenseView = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [date, setDate] = useState("");
  const [storeName, setStoreName] = useState("");
  const [image, setImage] = useState(null);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleSaveItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const handleDateChange = (text) => {
    setDate(text);
  };

  const handleStoreNameChange = (text) => {
    setStoreName(text);
  };

  const handleExpenseDelete = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const saveExpenseHandler = () => {
    // To-do
    navigation.navigate("MyExpenses");
  };

  const returnHandler = () => {
    // To-do
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      console.log("result", result);

      const imageResult = result.assets[0];
      const fileUri = imageResult.uri;
      const fileType = imageResult.file.type;
      const fileName = imageResult.file.name;
      setImage(fileUri);

      try {
        const res = await fetch(fileUri);
        const blob = await res.blob();
        const file = new File([blob], fileName, {
          type: fileType,
        });
        const formData = new FormData();
        formData.append("receipt", file);

        const responseData = await ExpensesService.createExpense(formData);

        const receipt_items = responseData.items;
        for (let i = 0; i < receipt_items.length; i++) {
          const item = {
            id: Math.random().toString(),
            rawName: receipt_items[i].name,
            name: receipt_items[i].name,
            cost: receipt_items[i].price,
            category: receipt_items[i].category,
          };
          setItems((prevItems) => [...prevItems, item]);
        }
        console.log("responseData:", responseData);
      } catch (error) {
        console.error("Error converting image to file:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={returnHandler}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <TouchableOpacity onPress={saveExpenseHandler}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageUploadContainer}>
        <View style={styles.imagePlaceholder}>
          <Text>Your image here</Text>
        </View>
        <View style={styles.imageOptions}>
          <TouchableOpacity style={styles.imageOptionButton}>
            <CameraIcon size={24} style={styles.icon} />
            <Text style={styles.imageOptionText}>Capture Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageOptionButton}
            onPress={pickImage}
          >
            <PhotoLibraryIcon size={24} style={styles.icon} />
            <Text style={styles.imageOptionText}>Photo Library</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Date"
            value={date}
            onChangeText={handleDateChange}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Store:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Store Name"
            value={storeName}
            onChangeText={handleStoreNameChange}
          />
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Items</Text>
          <TouchableOpacity style={styles.addItemButton} onPress={openModal}>
            <AddCircleIcon size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.scannedItemsContainer}>
          <DisplayExpenseItems
            items={items}
            onExpenseDelete={handleExpenseDelete}
          />
        </View>
      </View>

      <View style={styles.bottomNav}>
        <StatsChartOutlineIcon size={32} color="black" />
        <AddCircleIcon size={32} color="black" />
        <PeopleIcon size={32} color="black" />
        <PersonIcon size={32} color="black" />
      </View>

      <AddExpenseModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleSaveItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerButton: {
    color: "#007BFF",
    fontSize: 16,
  },
  imageUploadContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imageOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  imageOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  imageOptionText: {
    marginLeft: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    width: 60,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  scannedItemsContainer: {
    height: 320,
  },
  addItemButton: {
    alignSelf: "flex-start",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});

export default AddExpenseView;
