import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/OverviewCards";
import RecentTransactionsCard from "../components/RecentTransactionsCard";
import '/src/styles/style.scss';
import AddExpenseModal from "../components/AddExpenseModal";

const Dashboard = () => {

    return (
        <div>
            <Header />
            <OverviewCards/>
            <RecentTransactionsCard/>
            <AddExpenseModal />
            <Outlet />
        </div>
    )
}

export default Dashboard;