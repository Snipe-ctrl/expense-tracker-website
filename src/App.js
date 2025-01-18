import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./pages/SignupPage";
import SigninForm from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="signup" element={<SignupForm />} />
                    <Route path="signin" element={<SigninForm />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="protected"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;