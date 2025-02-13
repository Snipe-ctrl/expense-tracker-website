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

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0];

    // gets expense data
    const getTransactions = useCallback(async (date = firstDayOfMonth, limit) => {
        if (!user) return;

        try {
            setTransactionsLoading(true);
            const response = await apiFetch(`expenses?date=${date}&limit=${limit}`);
            if (response?.data && Array.isArray(response.data ) && response.data.length > 0) {
                setTransactions(response.data);
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
    }, [getTransactions]);

    return (
        <TransactionsContext.Provider value={{ transactions, transactionsLoading, getTransactions }}>
            {children}
        </TransactionsContext.Provider>
    )
};

export const useTransactions = () => useContext(TransactionsContext);