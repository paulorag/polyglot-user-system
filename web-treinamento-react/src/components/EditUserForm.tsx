"use client";
import { useState, useEffect } from "react";

interface User {
    id: number;
    nome: string;
}

interface EditUserFormProps {
    userToEdit: User;
    onUpdateUser: (id: number, newName: string) => void;
    onRequestClose: () => void;
}

export function EditUserForm({
    userToEdit,
    onUpdateUser,
    onRequestClose,
}: EditUserFormProps) {
    const [name, setName] = useState(userToEdit.nome);

    useEffect(() => {
        setName(userToEdit.nome);
    }, [userToEdit]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim()) return;
        onUpdateUser(userToEdit.id, name);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Editar Usuário (ID: {userToEdit.id})
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Nome
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nome do usuário"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );
}
