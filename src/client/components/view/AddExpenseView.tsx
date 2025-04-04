import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Pressable,
} from "react-native";
import CameraIcon from "../../assets/icons/CameraIcon";
import PhotoLibraryIcon from "../../assets/icons/PhotoLibraryIcon";
import AddCircleIcon from "../../assets/icons/AddCircleIcon";

import AddExpenseModal from "./AddExpenseModal";
import DisplayExpenseItems from "./DisplayExpenseItem";
import * as ImagePicker from "expo-image-picker";
import ExpensesService from "../../services/expensesService";
import { NavigationProps } from "../../types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../../contexts/UserContext";
import { MAX_FILE_SIZE } from "../../constants";

interface AddExpenseViewProps {
  navigation: NavigationProps;
  params?: {
    transactionData?: any;
    onChange?: () => void;
  } | null;
}

type Item = {
  id: number;
  rawName: string;
  name: string;
  cost: number;
  category: string;
  email: string | "";
  transactionDate: Date;
};

type Transaction = {
  date: string;
  store: string;
  userId: number;
  expenses: Item[];
};

const AddExpenseView = ({ navigation, params }: AddExpenseViewProps) => {
  const transactionData = params?.transactionData;
  const onSaveHandler = params?.onChange;

  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [date, setDate] = useState(new Date());
  const [storeName, setStoreName] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [currItem, setCurrItem] = useState<Item | null>(null);

  const [stores, setStores] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);

  const { user } = useUser();

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
  };

  React.useEffect(() => {
    if (transactionData) {
      setDate(new Date(transactionData.date + "T00:00:00"));
      setStoreName(transactionData.store);
      setItems(
        transactionData.expenses.map((item: Item, index: number) => ({
          ...item,
          id: index,
          email: user?.email || "",
        })),
      );
    }
  }, []);

  React.useEffect(() => {
    if (!user?.userid || !user.email) return;

    type Store = {
      store: string;
    };

    const fetchStores = async () => {
      const response = await ExpensesService.getStores(user?.userid);
      const stores = response.data as Store[];
      const filteredStores = [
        ...new Set(
          stores
            .map((item: Store) => item.store.toLowerCase())
            .filter((val) => val != ""),
        ),
      ];
      setStores(filteredStores);
    };

    fetchStores();
  }, []);

  const handleInputChange = (text: string) => {
    setStoreName(text);
    if (text.length > 0) {
      const filtered = stores.filter((word) =>
        word.startsWith(text.toLowerCase()),
      );
      setFilteredWords(filtered);
    } else {
      setFilteredWords([]);
    }
  };

  const handleSaveItem = (item: Item) => {
    if (currItem) {
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === item.id
            ? { ...item, email: user?.email || "" }
            : prevItem,
        ),
      );
    } else {
      setItems((prevItems) => [
        ...prevItems,
        { ...item, transactionDate: date, email: user?.email || "" },
      ]);
    }
    setCurrItem(null);
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleStoreNameChange = (text: string) => {
    setStoreName(text);
  };

  const handleExpenseUpdate = (item: any) => {
    setCurrItem(item);
    openModal();
  };

  const handleExpenseDelete = (itemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const saveExpenseHandler = async () => {
    const transaction: Transaction = {
      date: new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0], // workaround timezone stuff
      store: storeName,
      userId: user!.userid,
      expenses: items,
    };
    if (transactionData) {
      await ExpensesService.updateTransaction(transactionData.id, transaction);
    } else {
      await ExpensesService.createExpense(transaction);
    }

    onSaveHandler && onSaveHandler();
    returnHandler();
  };

  const returnHandler = () => {
    // To-do
    navigation.goBack();
  };

  const captureImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Camera access is required to take photos.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imageResult = result.assets[0];
      const fileUri = imageResult.uri;
      const fileType = imageResult.type || "image/jpeg";
      const fileName = fileUri.split("/").pop() || "captured_image.jpg";
      setImage(fileUri);
      setLoading(true);

      try {
        const res = await fetch(fileUri);
        const blob = await res.blob();
        const file = new File([blob], fileName, {
          type: fileType,
        });

        if (file.size > MAX_FILE_SIZE) {
          alert("File size exceeds the limit of 5MB.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("receipt", {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });

        const responseData = await ExpensesService.parseExpense(formData);

        const receipt_items = responseData.items;
        for (let i = 0; i < receipt_items.length; i++) {
          const item = {
            id: Math.random().toString(),
            rawName: receipt_items[i].name,
            name: receipt_items[i].name,
            cost: receipt_items[i].cost,
            category: receipt_items[i].category,
            email: user?.email || "",
            transactionDate: receipt_items[i].transaction_date,
          };
          setItems((prevItems) => [...prevItems, item]);
        }
      } catch (error) {
        console.error("Error processing captured image:", error);
      }

      setLoading(false);
    }
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
      const imageResult = result.assets[0];
      const fileUri = imageResult.uri;
      const fileType = imageResult.type || "image/jpeg";
      const fileName = fileUri.split("/").pop() || "uploaded_image.jpg";
      setImage(fileUri);
      setLoading(true);

      try {
        const res = await fetch(fileUri);
        const blob = await res.blob();
        const file = new File([blob], fileName, {
          type: fileType,
        });

        if (file.size > MAX_FILE_SIZE) {
          alert("File size exceeds the limit of 5MB.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("receipt", {
          uri: fileUri,
          name: fileName || "uploaded_image.jpg",
          type: fileType || "image/jpeg",
        });

        const responseData = await ExpensesService.parseExpense(formData);

        const receipt_items = responseData.items;
        for (let i = 0; i < receipt_items.length; i++) {
          const item = {
            id: Math.random().toString(),
            rawName: receipt_items[i].name,
            name: receipt_items[i].name,
            cost: receipt_items[i].cost,
            category: receipt_items[i].category,
            email: user?.email || "",
            transactionDate: receipt_items[i].transaction_date,
          };
          setItems((prevItems) => [...prevItems, item]);
        }
      } catch (error) {
        console.error("Error converting image to file:", error);
      }
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={returnHandler}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {transactionData ? "Update Expense" : "Add Expense"}
          </Text>
          <TouchableOpacity onPress={saveExpenseHandler} testID="save-button">
            <Text style={styles.headerButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageUploadContainer}>
          <View style={styles.imagePlaceholder}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <Text>Your image here</Text>
            )}
          </View>
          <View style={styles.imageOptions}>
            <TouchableOpacity
              style={styles.imageOptionButton}
              onPress={captureImage}
            >
              <CameraIcon size={24} />
              <Text style={styles.imageOptionText}>Capture Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageOptionButton}
              onPress={pickImage}
            >
              <PhotoLibraryIcon size={24} />
              <Text style={styles.imageOptionText}>Photo Library</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Date:</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, selectedDate) =>
                handleDateChange(selectedDate || date)
              }
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Store:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Store Name"
              value={storeName}
              onChangeText={(val) => {
                handleInputChange(val);
              }}
            />
          </View>

          {filteredWords.length > 0 && (
            <FlatList
              style={styles.flatList}
              data={filteredWords}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    handleStoreNameChange(item);
                    setFilteredWords([]);
                  }}
                >
                  <Text style={styles.flatListItem}>{item}</Text>
                </Pressable>
              )}
            />
          )}
        </View>

        <View style={styles.itemsContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Items</Text>
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => {
                openModal();
                setCurrItem(null);
              }}
              testID="add-item-button"
            >
              <AddCircleIcon size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.scannedItemsContainer}>
            <DisplayExpenseItems
              items={items}
              onExpenseUpdate={handleExpenseUpdate}
              onExpenseDelete={handleExpenseDelete}
              loading={loading}
            />
          </View>
        </View>

        <AddExpenseModal
          visible={isModalVisible}
          onClose={closeModal}
          onSave={handleSaveItem}
          data={currItem}
        />
      </View>
    </TouchableWithoutFeedback>
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
  flatList: {
    maxHeight: 200,
    marginTop: -8,
    borderRadius: 6,
  },
  flatListItem: {
    height: 36,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    backgroundColor: "#e0d8d7",
  },
});

export default AddExpenseView;
