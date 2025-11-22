"use client";

import { useState } from "react";

// Agora a função recebe um objeto com todos os dados
interface AddUserData {
    name: string;
    email: string;
    password: string;
}

interface AddUserFormProps {
    onAddUser: (data: AddUserData) => void; // Assinatura atualizada
    onRequestClose: () => void;
}

export function AddUserForm({ onAddUser, onRequestClose }: AddUserFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Validação básica
        if (!name.trim() || !email.trim() || !password.trim()) return;

        // Envia o objeto completo
        onAddUser({ name, email, password });

        setName("");
        setEmail("");
        setPassword("");
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Adicionar Novo Usuário
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo Nome */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome
                    </label>
                    <input
                        type="text"
                        placeholder="Nome do usuário"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Campo Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Campo Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Senha
                    </label>
                    <input
                        type="password"
                        placeholder="Senha de acesso"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Adicionar
                    </button>
                </div>
            </form>
        </div>
    );
}
