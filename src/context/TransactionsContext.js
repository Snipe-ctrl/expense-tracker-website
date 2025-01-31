import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import apiFetch from '../utils/apiFetch';
import { AuthContext } from "../context/AuthContext";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {

    const { user, loading } = useContext(AuthContext);

    // states for transaction data
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);

    // gets expense data
    const getTransactions = useCallback(async () => {
        if (!user) return;

        try {
            setTransactionsLoading(true);
            const response = await apiFetch('/expenses');
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