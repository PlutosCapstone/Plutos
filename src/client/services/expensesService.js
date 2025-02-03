import api from "../api/api";

const ExpensesService = {
  createExpense: async (expenseData) => {
    try {
      const response = await api.post(
        "/expenses/",
        JSON.stringify(expenseData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating expense:", error.message);
      throw error;
    }
  },

  parseExpense: async (receiptImage) => {
    try {
      const response = await api.post("/expenses/parse", receiptImage, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error parsing expense:", error.message);
      throw error;
    }
  },

  getUserExpenses: async (userid) => {
    try {
      const response = await api.get(`/expenses/${userid}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
      throw error;
    }
  },

  updateExpense: async (expenseId, updatedData) => {
    try {
      const response = await api.put(`/expenses/${expenseId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating expense:", error.message);
      throw error;
    }
  },

  deleteExpense: async (expenseId) => {
    try {
      const response = await api.delete(`/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting expense:", error.message);
      throw error;
    }
  },
};

export default ExpensesService;
