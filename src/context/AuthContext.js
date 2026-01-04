import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedAuth = localStorage.getItem("isAuthenticated");
        const loginTime = localStorage.getItem("loginTime");

        if (storedAuth === "true" && loginTime) {
            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - parseInt(loginTime, 10);
            const oneHour = 3600000; // 1 hour in ms

            if (timeElapsed < oneHour) {
                setIsAuthenticated(true);
                // Set auto-logout for remaining time
                const remainingTime = oneHour - timeElapsed;
                setTimeout(() => logout(), remainingTime);
            } else {
                // Session expired
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Hardcoded credentials as requested
        if (email === "adroits@gmail.com" && password === "adroits@001") {
            setIsAuthenticated(true);
            const currentTime = new Date().getTime();
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("loginTime", currentTime.toString());

            // Set auto-logout timer for 1 hour
            setTimeout(() => logout(), 3600000);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("loginTime");
        // Optional: Redirect to login is handled by protected routes usually
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
