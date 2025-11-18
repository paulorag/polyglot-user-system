const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const excludePassword = (user) => {
    if (user) {
        delete user.password;
    }
    return user;
};

const getAllUsers = async (req, res) => {
    const users = await prisma.user.findMany();
    const usersWithoutPasswords = users.map(excludePassword);
    res.status(200).json(usersWithoutPasswords);
};

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
        where: { id: id },
    });

    if (user) {
        res.status(200).json(excludePassword(user));
    } else {
        res.sendStatus(404);
    }
};

const createUser = async (req, res) => {
    const { nome, email, password } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: "O nome é obrigatório" });
    }
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email e senha também são obrigatórios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                nome: nome,
                email: email,
                password: hashedPassword,
            },
        });
        res.status(201).json(excludePassword(newUser));
    } catch (error) {
        if (error.code === "P2002") {
            return res
                .status(409)
                .json({ error: "Este email já está em uso." });
        }
        res.status(500).json({ error: "Falha ao criar usuário." });
    }
};

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email, password } = req.body;

    if (!nome) {
        return res.status(400).json({ error: "O nome é obrigatório" });
    }

    try {
        const dataToUpdate = {
            nome: nome,
            email: email,
        };

        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: dataToUpdate,
        });
        res.status(200).json(excludePassword(updatedUser));
    } catch (error) {
        if (error.code === "P2025") {
            return res.sendStatus(404);
        }
        if (error.code === "P2002") {
            return res
                .status(409)
                .json({ error: "Este email já está em uso." });
        }
        res.status(500).json({ error: "Falha ao atualizar usuário." });
    }
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.user.delete({ where: { id: id } });
        res.sendStatus(204);
    } catch (error) {
        if (error.code === "P2025") {
            return res.sendStatus(404);
        }
        res.sendStatus(500);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
