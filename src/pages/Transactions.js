import React, { useState } from "react";
import Header from "../components/Header";
import AddExpenseModal from "../components/dashboard-components/AddExpenseModal";
import DeleteExpenseModal from "../components/dashboard-components/DeleteExpenseModal";
import TransactionsCard from "../components/dashboard-components/RecentTransactionsCard";
import { useTransactions } from '../context/TransactionsContext';

const TransactionsPage = () => {
    const {
        transactions,
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
    } = useTransactions();

    return (
        <div>
            <Header />
            <TransactionsCard 
                isDashboard={false}
                transactions={transactions}
                onAddExpense={() => setIsAddExpenseOpen(true)} 
                onEditExpense={(transaction) => {
                    setEditingTransaction(transaction);
                    setIsAddExpenseOpen(true);
                }}
                onDeleteExpense={(expenseId) => {
                    setSelectedExpenseId(expenseId);
                    setIsDeleteExpenseOpen(true);
                }}
            />
            {isAddExpenseOpen && (
                <AddExpenseModal
                    onClose={() => setIsAddExpenseOpen(false)}
                    onExpenseAdded={getTransactions}
                    editingTransaction={editingTransaction}
                />
            )}

            {isDeleteExpenseOpen && (
                <DeleteExpenseModal
                    expenseId={selectedExpenseId}
                    onClose={() => {
                        setIsDeleteExpenseOpen(false);
                        setSelectedExpenseId(null);
                    }}
                    onDeleteSuccess={getTransactions}
                />
            )}
        </div>
    )
}

export default TransactionsPage;