import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import apiFetch from '../utils/apiFetch';
import { AuthContext } from "../context/AuthContext";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {

    // gets user data from auth context
    const { user } = useContext(AuthContext);

    // states for transaction data
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);

    // Editing transaction state
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Selected expense ID state
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);

    // States for modals
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // gets expense data
    const getTransactions = useCallback(async (month = currentMonth, year = currentYear) => {
        if (!user) return;

        try {
            setTransactionsLoading(true);
            const response = await apiFetch(`expenses?year=${year}&month=${month}`);
            if (response?.data && Array.isArray(response.data)) {
                setTransactions(response.data);
            } else {
                setTransactions([])
            }
        } catch (err) {
            console.error('Error fetching transaction data: ', err);
        } finally {
            setTransactionsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            getTransactions();
        }
    }, []);

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                setTransactions,
                transactionsLoading,
                getTransactions,
                editingTransaction,
                setEditingTransaction,
                selectedExpenseId,
                setSelectedExpenseId,
                isAddExpenseOpen,
                setIsAddExpenseOpen,
                isDeleteExpenseOpen,
                setIsDeleteExpenseOpen,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    )
};

export const useTransactions = () => useContext(TransactionsContext);