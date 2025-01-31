import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/OverviewCards";
import RecentTransactionsCard from "../components/RecentTransactionsCard";
import '/src/styles/style.scss';
import AddExpenseModal from "../components/AddExpenseModal";

const Dashboard = () => {

    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [refreshTransactions, setRefreshTransactions] = useState(() => () => {});

    const handleAddExpense = (getRecentTransactions) => {
        setIsAddExpenseOpen(true);
        setRefreshTransactions(() => getRecentTransactions);
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