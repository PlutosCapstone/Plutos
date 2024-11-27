import api from "../api/api";

const ExpensesService = {
  createExpense: async (expenseData) => {
    try {
      const response = await api.post("/expenses/", expenseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating expense:", error.message);
      throw error;
    }
  },

  getUserExpenses: async (userId) => {
    try {
      const response = await api.get(`/expenses/${userId}`);
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
