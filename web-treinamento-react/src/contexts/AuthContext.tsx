"use client";

import {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { setCookie, parseCookies, destroyCookie } from "nookies";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    signIn: (data: SignInData) => Promise<void>;
    signOut: () => void;
}

interface SignInData {
    email: string;
    password: string;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const isAuthenticated = !!user;
    const router = useRouter();

    useEffect(() => {
        const { "treinamento.token": token } = parseCookies();

        if (token) {
            setUser({ token });
        }
    }, []);

    async function signIn({ email, password }: SignInData) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                throw new Error("Falha no login");
            }

            const { token, user } = await response.json();
            console.log("TOKEN RECEBIDO DA API:", token);

            setCookie(undefined, "treinamento.token", token, {
                maxAge: 60 * 60,
                path: "/",
            });

            const cookiesAgora = parseCookies();
            console.log("COOKIES APÓS SALVAR:", cookiesAgora);

            setUser({ ...user, token });

            router.push("/");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    function signOut() {
        destroyCookie(undefined, "treinamento.token");
        setUser(null);
        router.push("/login");
    }

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
