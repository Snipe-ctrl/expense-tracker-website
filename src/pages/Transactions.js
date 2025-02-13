import React, { useState } from "react";
import { handleAddExpense, handleDeleteExpense, handleEditExpense } from "./Dashboard";
import TransactionsCard from "../components/dashboard-components/RecentTransactionsCard";
import Header from "../components/Header";

const TransactionsPage = () => {
    return (
        <div>
            <Header />
            <TransactionsCard 
                isDashboard={false}
                onAddExpense={handleAddExpense} 
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense} 
            />
         </div>
    )
}

export default TransactionsPage;