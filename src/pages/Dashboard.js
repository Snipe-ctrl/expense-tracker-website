import React, { useState } from "react";
import { Outlet } from 'react-router-dom';
import '/src/styles/style.scss';
import Header from "../components/Header";

const Dashboard = () => {

    return (
        <div>
            <Header />
            <h1>Dashboard</h1>
            <Outlet />
        </div>
    )
}

export default Dashboard;