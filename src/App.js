import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./pages/SignupPage";
import SigninForm from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import Transactions from "./pages/Transactions";
import AuthProvider from "./context/AuthContext";
import { TransactionsProvider } from "./context/TransactionsContext";

const App = () => {
    return (
        <AuthProvider>
            <TransactionsProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<SigninForm />} />
                        <Route path="signup" element={<SignupForm />} />
                        <Route path="signin" element={<SigninForm />} />
                        <Route 
                            path="dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="transactions" 
                            element={
                                <ProtectedRoute>
                                    <Transactions />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </Router>
            </TransactionsProvider>
        </AuthProvider>
    );
};

export default App;