import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface DisplayExpenseItemsProps {
  // Types TBD
  items: any[];
  loading: boolean;
  onExpenseUpdate: (...args: any[]) => void;
  onExpenseDelete: (...args: any[]) => void;
}

const DisplayExpenseItems = ({
  items,
  onExpenseUpdate,
  onExpenseDelete,
  loading,
}: DisplayExpenseItemsProps) => {
  if (loading) {
    return <ActivityIndicator size="large" testID="activity-indicator" />;
  }
  if (items.length === 0) {
    return <Text style={styles.emptyText}>No items added yet!</Text>;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemCard}>
          <View style={styles.content}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemText}>Category: {item.category}</Text>
            <Text style={styles.itemText}>Cost: ${item.cost}</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => onExpenseUpdate(item)}
            >
              <Text style={styles.deleteText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onExpenseDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    flexDirection: "column",
    flex: 6,
  },
  buttons: {
    flexDirection: "column",
    flex: 2,
    margin: 2,
    gap: 10,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  updateButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
  },
  itemText: {
    marginTop: 5,
    fontSize: 16,
    color: "#555",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default DisplayExpenseItems;
