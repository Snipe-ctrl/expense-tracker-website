import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/OverviewCards";
import RecentTransactionsCard from "../components/RecentTransactionsCard";
import AddExpenseModal from "../components/AddExpenseModal";
import DeleteExpenseModal from "../components/DeleteExpenseModal";
import '/src/styles/style.scss';

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

    // handles logic for adding expense
    const handleAddExpense = (getRecentTransactions) => {
        setEditingTransaction(null);
        setIsAddExpenseOpen(true);
        setRefreshTransactions(() => getRecentTransactions);
    };

    // handles logic for editing expense
    const handleEditExpense = (transaction) => {
        setEditingTransaction(transaction);
        setIsAddExpenseOpen(true);
    }

    // handles logic for deleting expense
    const handleDeleteExpense = (expenseId, getRecentTransactions) => {
        setSelectedExpenseId(expenseId);
        setIsDeleteExpenseOpen(true);
        setRefreshTransactions(() => getRecentTransactions);
    };

    return (
        <div>
            <Header />
            <OverviewCards/>
            <RecentTransactionsCard 
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