import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const server = 'http://localhost:5000';

export interface User {
    _id: string,
    name: string,
    email: string,
    role: string,
    playlist: string[]
}

interface UserContextType {
    user: User | null,
    isAuth: boolean,
    loading: boolean,
    btnLoading: boolean,
    loginUser: (email: string, password: string, navigate: (path: string) => void) => Promise<void>,
    logoutUser: () => void,
    registerUser: (email: string, password: string, name: string, navigate: (path: string) => void) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProvidedProps {
    children: ReactNode
}

export const UserProvider = ({ children }: UserProvidedProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    function logoutUser() {
        localStorage.clear();
        setUser(null);
        setIsAuth(false);
        toast.success("Logout successful");
    }

    async function loginUser(email: string, password: string, navigate: (path: string) => void) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/user/login`, { email, password });
            toast.success(data.message);
            localStorage.setItem("token", data.token);
            setUser(data.user);
            setIsAuth(true);
            navigate('/')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred");
        }
        finally {
            setBtnLoading(false);
        }
    }

    async function registerUser(email: string, name: string, password: string, navigate: (path: string) => void) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/user/register`, { email, password, name });
            toast.success(data.message);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuth(true);
            navigate('/')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred");
        }
        finally {
            setBtnLoading(false);
        }
    }

    async function fetchUser() {
        setLoading(true)
        try {
            const { data } = await axios.get<User | null>(`${server}/api/v1/user/me`, {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
            setUser(data);
            setIsAuth(true);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return <UserContext.Provider value={{ user, loading, isAuth, btnLoading, loginUser, logoutUser, registerUser }}>
        {children}
        <Toaster />
    </UserContext.Provider>
}

export const useUserData = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("userData must be used within a userProvider");
    }
    return context;
}