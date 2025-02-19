import React, { useState, useContext } from "react";
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/dashboard-components/OverviewCards";
import TransactionsCard from "../components/dashboard-components/TransactionsModal";
import AddExpenseModal from "../components/dashboard-components/AddExpenseModal";
import DeleteExpenseModal from "../components/dashboard-components/DeleteExpenseModal";
import { useTransactions } from '../context/TransactionsContext';
import { AuthContext } from '../context/AuthContext';
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

    const { user, userLoading } = useContext(AuthContext);

    if (userLoading) {
        return (
            <div className='main-spinner-container'>
                <div className='spinner'></div>
            </div>
        )
    };

    return (
        <div>
            <Header />
            <OverviewCards/>
            <TransactionsCard 
                isDashboard={true}
                onAddExpense={() => {
                    setEditingTransaction(null)
                    setIsAddExpenseOpen(true)}
                }
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
                    onExpenseAdded={getTransactions}
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