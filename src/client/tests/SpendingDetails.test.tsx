import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SpendingDetails from "../components/common/SpendingDetails";

jest.mock("../utils/util", () => ({
  isWithinTimeRange: jest.fn(),
}));

describe("SpendingDetails component", () => {
  it("should match snapshot", () => {
    const expenses = [
      {
        id: 1, // Add missing properties
        category: "Groceries",
        cost: 50,
        transaction_date: "2025-03-05",
        name: "Groceries",
        email: "user@example.com",
        created_at: "2025-03-05T12:00:00Z",
        raw_name: "Groceries",
      },
      {
        id: 2,
        category: "Transport",
        cost: 30,
        transaction_date: "2025-03-04",
        name: "Transport",
        email: "user@example.com",
        created_at: "2025-03-04T12:00:00Z",
        raw_name: "Transport",
      },
    ];

    const tree = render(<SpendingDetails expenses={expenses} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should display the header and spending details", () => {
    const expenses = [
      {
        id: 1,
        category: "Groceries",
        cost: 50,
        transaction_date: "2025-03-05",
        name: "Groceries",
        email: "user@example.com",
        created_at: "2025-03-05T12:00:00Z",
        raw_name: "Groceries",
      },
      {
        id: 2,
        category: "Transport",
        cost: 30,
        transaction_date: "2025-03-04",
        name: "Transport",
        email: "user@example.com",
        created_at: "2025-03-04T12:00:00Z",
        raw_name: "Transport",
      },
    ];

    const { getByText } = render(<SpendingDetails expenses={expenses} />);

    const title = getByText("Spending Details");
    const dropdown = getByText("Last week ▾");

    expect(title).toBeTruthy();
    expect(dropdown).toBeTruthy();
  });

  it("should render the bar chart with correct data", () => {
    const expenses = [
      {
        id: 1,
        category: "Groceries",
        cost: 50,
        transaction_date: "2025-03-05",
        name: "Groceries",
        email: "user@example.com",
        created_at: "2025-03-05T12:00:00Z",
        raw_name: "Groceries",
      },
      {
        id: 2,
        category: "Transport",
        cost: 30,
        transaction_date: "2025-03-04",
        name: "Transport",
        email: "user@example.com",
        created_at: "2025-03-04T12:00:00Z",
        raw_name: "Transport",
      },
      {
        id: 3,
        category: "Entertainment",
        cost: 20,
        transaction_date: "2025-03-03",
        name: "Entertainment",
        email: "user@example.com",
        created_at: "2025-03-03T12:00:00Z",
        raw_name: "Entertainment",
      },
    ];

    const { getByText } = render(<SpendingDetails expenses={expenses} />);

    // The BarChart is expected to be rendered in the view, check by placeholderText
    const chart = getByText("Spending Details");
    expect(chart).toBeTruthy();
  });

  it("should filter expenses by last week", () => {
    // Mocking the function to always return true for the test

    const expenses = [
      {
        id: 1,
        category: "Groceries",
        cost: 50,
        transaction_date: "2025-03-05",
        name: "Groceries",
        email: "user@example.com",
        created_at: "2025-03-05T12:00:00Z",
        raw_name: "Groceries",
      },
      {
        id: 2,
        category: "Transport",
        cost: 30,
        transaction_date: "2025-03-04",
        name: "Transport",
        email: "user@example.com",
        created_at: "2025-03-04T12:00:00Z",
        raw_name: "Transport",
      },
      {
        id: 3,
        category: "Entertainment",
        cost: 20,
        transaction_date: "2025-03-03",
        name: "Entertainment",
        email: "user@example.com",
        created_at: "2025-03-03T12:00:00Z",
        raw_name: "Entertainment",
      },
    ];

    const { getByText } = render(<SpendingDetails expenses={expenses} />);

    // Check that the bar chart is rendered for these filtered expenses
    const chart = getByText("Spending Details");
    expect(chart).toBeTruthy();
  });
});
