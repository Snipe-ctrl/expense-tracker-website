import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./pages/SignupPage";
import SigninForm from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import AuthProvider from "./utils/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SignupForm />} />
                    <Route path="signup" element={<SignupForm />} />
                    <Route path="signin" element={<SigninForm />} />
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