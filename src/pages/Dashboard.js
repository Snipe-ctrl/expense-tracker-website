import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import OverviewCards from "../components/OverviewCards";
import '/src/styles/style.scss';

const Dashboard = () => {

    return (
        <div>
            <Header />
            <OverviewCards/>
            <Outlet />
        </div>
    )
}

export default Dashboard;