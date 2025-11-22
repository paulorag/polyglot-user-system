"use client";

import { useState, useEffect, useCallback } from "react";
import { UserItem } from "./UserItem";
import { AddUserForm } from "./AddUserForm";
import { EditUserForm } from "./EditUserForm";
import { Modal } from "./Modal";
import toast from "react-hot-toast";
import { parseCookies } from "nookies";

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

    const getAuthHeaders = () => {
        const { "treinamento.token": token } = parseCookies();
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { "treinamento.token": token } = parseCookies();

            if (!token) {
                throw new Error("Sessão expirada. Faça login novamente.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                throw new Error("Não autorizado. Faça login novamente.");
            }

            if (!response.ok) throw new Error("Falha ao buscar dados");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    interface AddUserData {
        name: string;
        email: string;
        password: string;
    }

    const handleAddUser = async (userData: AddUserData) => {
        setIsLoading(true);
        setError(null);
        const loadingToastId = toast.loading("Adicionando usuário...");
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                {
                    method: "POST",
                    headers: getAuthHeaders(),
                    // Agora enviamos nome, email e senha no JSON
                    body: JSON.stringify({
                        nome: userData.name,
                        email: userData.email,
                        password: userData.password,
                    }),
                }
            );
            if (!response.ok) {
                // Tenta pegar a mensagem de erro da API (ex: email duplicado)
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Falha ao adicionar usuário"
                );
            }

            toast.success("Usuário adicionado com sucesso!");
            setIsAddModalOpen(false);
            fetchUsers();
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro desconhecido";
            toast.error(`Erro: ${errorMessage}`);
            // Não setamos o erro global da lista para não esconder a lista existente
            // setError(errorMessage);
            setIsLoading(false);
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    const handleUpdate = async (id: number, newName: string) => {
        const loadingToast = toast.loading("Atualizando...");
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                {
                    method: "PUT",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ nome: newName }),
                }
            );
            if (!response.ok) throw new Error("Erro ao atualizar");
            toast.success("Atualizado!");
            setIsEditModalOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (e) {
            toast.error("Erro ao atualizar");
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleDelete = async (id: number) => {
        const loadingToast = toast.loading("Deletando...");
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                }
            );
            if (!response.ok) throw new Error("Erro ao deletar");
            toast.success("Deletado!");
            fetchUsers();
        } catch (e) {
            toast.error("Erro ao deletar");
        } finally {
            toast.dismiss(loadingToast);
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
                {isLoading && (
                    <p className="text-center text-gray-400">
                        Carregando usuários...
                    </p>
                )}
                {error && (
                    <p className="text-center text-red-500">Erro: {error}</p>
                )}
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
                contentLabel="Adicionar"
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
                    contentLabel="Editar"
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
