import React, { useState } from "react";
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/dashboard-components/OverviewCards";
import TransactionsCard from "../components/dashboard-components/RecentTransactionsCard";
import AddExpenseModal from "../components/dashboard-components/AddExpenseModal";
import DeleteExpenseModal from "../components/dashboard-components/DeleteExpenseModal";
import { useTransactions } from '../context/TransactionsContext';
import '/src/styles/style.scss';

const Dashboard = () => {
    const {
        transactions,
        transactionsLoading,
        getTransactions,
        editingTransaction,
        setEditingTransaction,
        selectedExpenseId,
        setSelectedExpenseId,
        refreshTransactions,
        setRefreshTransactions,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isDeleteExpenseOpen,
        setIsDeleteExpenseOpen,
    } = useTransactions();

    return (
        <div>
            <Header />
            <OverviewCards/>
            <TransactionsCard 
                isDashboard={true}
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
            {isAddExpenseOpen && 
                <AddExpenseModal 
                    onClose={() => setIsAddExpenseOpen(false)}
                    onExpenseAdded={refreshTransactions}
                    editingTransaction={editingTransaction}
                />}
            {isDeleteExpenseOpen &&
                <DeleteExpenseModal
                    expenseId={selectedExpenseId}
                    onClose={() => {
                        setIsDeleteExpenseOpen(false);
                        setSelectedExpenseId(null);
                    }}
                    onDeleteSuccess={refreshTransactions}
                />}
            <Outlet />
        </div>
    )
}

export default Dashboard;