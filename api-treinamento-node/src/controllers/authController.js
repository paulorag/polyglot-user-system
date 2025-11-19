const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const excludePassword = (user) => {
    const userWithNoPassword = { ...user };
    delete userWithNoPassword.password;
    return userWithNoPassword;
};

const register = async (req, res) => {
    const { nome, email, password } = req.body;

    if (!email || !password || !nome) {
        return res
            .status(400)
            .json({ error: "Todos os campos são obrigatórios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { nome, email, password: hashedPassword },
        });
        res.status(201).json(excludePassword(user));
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "Email já existe" });
        }
        res.status(500).json({ error: "Erro ao registrar usuários" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            token,
            user: excludePassword(user),
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao realizar login" });
    }
};

module.exports = { register, login };
