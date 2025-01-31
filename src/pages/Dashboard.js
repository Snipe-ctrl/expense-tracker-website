import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/OverviewCards";
import RecentTransactionsCard from "../components/RecentTransactionsCard";
import AddExpenseModal from "../components/AddExpenseModal";
import '/src/styles/style.scss';

const Dashboard = () => {

    // states for transaction data
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);

    // states for add expense modal
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [refreshTransactions, setRefreshTransactions] = useState(() => () => {});

    // handles logic for adding expense
    const handleAddExpense = (getRecentTransactions) => {
        setIsAddExpenseOpen(true);
        setRefreshTransactions(() => getRecentTransactions);
    };

    // gets expense data for dashboard
    const fetchExpenses = async () => {
        try {
            const response = await apiFetch('/expenses');
            const transactionsData = response.data;
        } catch (err) {
            console.error('Error fetching transaction data: ', err);
        }
    };

    return (
        <div>
            <Header />
            <OverviewCards/>
            <RecentTransactionsCard onAddExpense={handleAddExpense} />
            {isAddExpenseOpen && 
                <AddExpenseModal 
                    onClose={() => setIsAddExpenseOpen(false)}
                    onExpenseAdded={refreshTransactions}
                />}
            <Outlet />
        </div>
    )
}

export default Dashboard;