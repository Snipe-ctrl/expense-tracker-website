import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./pages/SignupPage";
import SigninForm from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignupForm />} />
                <Route path="signup" element={<SignupForm />} />
                <Route path="signin" element={<SigninForm />} />
                <Route path="protected" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;