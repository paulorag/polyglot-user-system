"use client";

import { Header } from "@/components/Header";
import { UserList } from "@/components/UserList";
import { useAuth } from "@/contexts/AuthContext"; // 1. Importamos o contexto
import Link from "next/link";

export default function Home() {
    // 2. Pegamos o estado de autenticação e a função de logout
    const { isAuthenticated, signOut } = useAuth();

    return (
        <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
            <Header title="Sistema de Gerenciamento de Usuários" />

            <div className="w-full max-w-2xl px-4 mt-10">
                {/* 3. Renderização Condicional */}
                {!isAuthenticated ? (
                    // --- VISÃO DE VISITANTE (Não Logado) ---
                    <div className="flex flex-col items-center text-center space-y-8 bg-gray-800 p-10 rounded-xl shadow-lg">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                Bem-vindo!
                            </h2>
                            <p className="text-gray-400">
                                Para acessar o sistema e gerenciar usuários,
                                você precisa estar autenticado.
                            </p>
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <Link
                                href="/login"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition w-full max-w-[150px]"
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition w-full max-w-[150px]"
                            >
                                Criar Conta
                            </Link>
                        </div>
                    </div>
                ) : (
                    // --- VISÃO DE USUÁRIO (Logado) ---
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="text-green-400 font-semibold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Autenticado
                                </p>
                            </div>

                            <button
                                onClick={signOut}
                                className="px-4 py-2 text-sm border border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded transition"
                            >
                                Sair do Sistema
                            </button>
                        </div>

                        {/* Aqui entra a nossa lista poderosa */}
                        <UserList />
                    </div>
                )}
            </div>
        </main>
    );
}
