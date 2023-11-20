import React, { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

export type LoginProps = {
    username: string;
    password: string;
};

interface User {
    email: string
}

export interface AuthContextData {
    authenticated: boolean;
    user: User | null;
    authLoading: boolean;
    Login: ({}: LoginProps) => Promise<number | undefined>;
    clearUser: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: any) => {
    
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        async function getLocalToken() {
        const jwtToken = localStorage.getItem("jwt-token"); // name needs to be put into env file
        const user: User | null = (jwtToken? jwtDecode(jwtToken): null)
        if (user && jwtToken) {
            setUser(user);
        }
        setAuthLoading(false);
    }
    
        getLocalToken();
    }, []);
    const Login = async ({ username, password }: LoginProps) => {
        const token = await axios.post('https://api.buurtsporen.be/login',{ // link needs to go into env
        username,
        password
        })
        if (token) {
            localStorage.setItem('jwt-token', JSON.stringify(token?.data?.access_token)) // name needs to go into env
            const jwtToken = localStorage.getItem("jwt-token"); // name needs to be put into env file
            const user: User | null = (jwtToken? jwtDecode(jwtToken): null)
            if (user && jwtToken) {
                setUser(user);
            }
            setAuthLoading(false);
            return token.status;
        }
    }

    const clearUser = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ authenticated: !!user, authLoading, user, Login, clearUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};