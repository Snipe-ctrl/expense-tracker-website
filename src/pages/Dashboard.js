import React, { useState } from "react";
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/dashboard-components/OverviewCards";
import TransactionsCard from "../components/dashboard-components/RecentTransactionsCard";
import AddExpenseModal from "../components/dashboard-components/AddExpenseModal";
import DeleteExpenseModal from "../components/dashboard-components/DeleteExpenseModal";
import '/src/styles/style.scss';

    // handles logic for adding expense
    export const handleAddExpense = (getRecentTransactions) => {
        setEditingTransaction(null);
        setIsAddExpenseOpen(true);
        setRefreshTransactions(() => getRecentTransactions);
    };

    // handles logic for editing expense
    export const handleEditExpense = (transaction) => {
        setEditingTransaction(transaction);
        setIsAddExpenseOpen(true);
    }

    // handles logic for deleting expense
    export const handleDeleteExpense = (expenseId, getRecentTransactions) => {
        setSelectedExpenseId(expenseId);
        setIsDeleteExpenseOpen(true);
        setRefreshTransactions(() => getRecentTransactions);
    };


const Dashboard = () => {
    // editing transaction states
    const [editingTransaction, setEditingTransaction] = useState(null);

    // slected expense id states
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);

    // states for refreshing transactions
    const [refreshTransactions, setRefreshTransactions] = useState(() => () => {});

    // states for transaction data
    const [transaction, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);

    // states for add expense modal
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    // states for delete expense modal
    const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);

    return (
        <div>
            <Header />
            <OverviewCards/>
            <TransactionsCard 
                isDashboard={true}
                onAddExpense={handleAddExpense} 
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense} 
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