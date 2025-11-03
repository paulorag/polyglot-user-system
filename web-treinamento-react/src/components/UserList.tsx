"use client";

import { useState, useEffect, useCallback } from "react";
import { UserItem } from "./UserItem";
import { AddUserForm } from "./AddUserForm";
import { EditUserForm } from "./EditUserForm";
import { Modal } from "./Modal";
import toast from "react-hot-toast";

interface User {
    id: number;
    nome: string;
}

export function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users`
            );
            if (!response.ok) throw new Error("Falha ao buscar dados");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error("Falha ao buscar usuários:", err);
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAddUser = async (name: string) => {
        setIsLoading(true);
        setError(null);
        const loadingToastId = toast.loading("Adicionando usuário...");
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome: name }),
                }
            );
            if (!response.ok) throw new Error("Falha ao adicionar usuário");
            toast.success("Usuário adicionado com sucesso!");
            setIsAddModalOpen(false);
            fetchUsers();
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro desconhecido";
            toast.error(`Erro: ${errorMessage}`);
            setError(errorMessage);
            setIsLoading(false);
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    const handleUpdate = async (id: number, newName: string) => {
        setIsLoading(true);
        setError(null);
        const loadingToastId = toast.loading("Atualizando usuário...");
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nome: newName }),
                }
            );
            if (!response.ok) throw new Error("Falha ao atualizar usuário");
            toast.success("Usuário atualizado com sucesso!");
            setIsEditModalOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro desconhecido";
            toast.error(`Erro: ${errorMessage}`);
            setError(errorMessage);
            setIsLoading(false);
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    const handleDelete = async (id: number) => {
        setIsLoading(true);
        setError(null);
        const loadingToastId = toast.loading("Deletando usuário...");
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) throw new Error("Falha ao deletar usuário");
            toast.success("Usuário deletado com sucesso!");
            fetchUsers();
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro desconhecido";
            toast.error(`Erro: ${errorMessage}`);
            setError(errorMessage);
            setIsLoading(false);
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="w-full max-w-2xl p-4 bg-gray-800 rounded-lg space-y-4">
            <div className="text-right">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Adicionar Usuário
                </button>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                    Lista de Usuários da API
                </h2>
                {!isLoading && !error && (
                    <ul>
                        {users.map((user) => (
                            <UserItem
                                key={user.id}
                                user={user}
                                onDelete={handleDelete}
                                onOpenEditModal={openEditModal}
                            />
                        ))}
                    </ul>
                )}
            </div>
            <Modal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                contentLabel="Adicionar Novo Usuário"
            >
                <AddUserForm
                    onAddUser={handleAddUser}
                    onRequestClose={() => setIsAddModalOpen(false)}
                />
            </Modal>
            {editingUser && (
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    contentLabel="Editar Usuário"
                >
                    <EditUserForm
                        userToEdit={editingUser}
                        onUpdateUser={handleUpdate}
                        onRequestClose={closeEditModal}
                    />
                </Modal>
            )}
        </div>
    );
}
