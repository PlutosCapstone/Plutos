import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { TIME_RANGES } from "../../constants";

const screenWidth = Dimensions.get("window").width;

interface TimeRangeDropdownProps {
  timeRange: string;
  setTimeRange: (timeRange: string) => void;
}

const TimeRangeDropdown = ({
  timeRange,
  setTimeRange,
}: TimeRangeDropdownProps) => {
  return (
    <Dropdown
      data={TIME_RANGES}
      labelField="label"
      valueField="value"
      value={timeRange}
      onChange={(item) => setTimeRange(item.value)}
      placeholder=""
      style={styles.dropdown}
      selectedTextStyle={{
        fontSize: 12,
        color: "#444",
      }}
      iconStyle={{
        width: 12,
        height: 12,
        tintColor: "#444",
      }}
      containerStyle={styles.dropdownContainer}
      itemTextStyle={styles.dropdownItem}
      renderRightIcon={() => (
        <Text
          style={{
            fontSize: 12,
            color: "#666",
          }}
        >
          ▼
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderBottomWidth: 0,
    backgroundColor: "transparent",
    minWidth: screenWidth * 0.33,
  },
  dropdownContainer: {
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: "#fff",
    paddingVertical: 4,
  },
  dropdownItem: {
    fontSize: 12,
    color: "#333",
  },
});

export default TimeRangeDropdown;
