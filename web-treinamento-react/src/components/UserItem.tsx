"use client";

interface User {
    id: number;
    nome: string;
}

interface UserItemProps {
    user: User;
    onDelete: (id: number) => void;
    onOpenEditModal: (user: User) => void; // <-- Nova prop
}

export function UserItem({ user, onDelete, onOpenEditModal }: UserItemProps) {
    return (
        <li className="flex justify-between items-center text-gray-300 p-2 border-b border-gray-700">
            <span>
                {user.nome} (ID: {user.id})
            </span>

            <div className="flex gap-2">
                <button
                    onClick={() => onOpenEditModal(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                    Editar
                </button>

                <button
                    onClick={() => onDelete(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                    Deletar
                </button>
            </div>
        </li>
    );
}
