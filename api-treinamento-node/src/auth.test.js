const request = require("supertest");
const app = require("./app");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

let prisma;

beforeEach(async () => {
    prisma = new PrismaClient();

    await prisma.user.deleteMany({});

    const hashedPassword = await bcrypt.hash("senha123", 10);
    await prisma.user.create({
        data: {
            id: 1,
            email: "teste@login.com",
            nome: "Usuario Login",
            password: hashedPassword,
        },
    });
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT MAX(id) FROM "User"))`;
});

afterAll(async () => {
    if (prisma) {
        await prisma.$disconnect();
    }
});

describe("POST / auth/register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
        const res = await request(app).post("/auth/register").send({
            nome: "Novo registro",
            email: "novo@email.com",
            password: "123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.email).toBe("novo@email.com");
        expect(res.body).not.toHaveProperty("password");
    });
});

describe("POST / auth/login", () => {
    it("deve fazer login e retornar um token JWT", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "teste@login.com",
            password: "senha123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("user");
    });

    it("deve negar login com senha incorreta", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "teste@login.com",
            password: "senhaERRADA",
        });

        expect(res.statusCode).toBe(401);
    });
});
