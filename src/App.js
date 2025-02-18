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
                        <Route path="/" element={<Dashboard />} />
                        <Route path="signup" element={<SignupForm />} />
                        <Route path="signin" element={<SigninForm />} />
                        {}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="protected"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
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