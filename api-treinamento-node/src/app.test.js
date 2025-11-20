const request = require("supertest");
const app = require("./app");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");

let prisma;
let token;

beforeEach(async () => {
    prisma = new PrismaClient();
    await prisma.user.deleteMany({});

    const hashedPassword = await bcrypt.hash("senha123", 10);

    await prisma.user.createMany({
        data: [
            {
                id: 1,
                email: "paulo@teste.com",
                nome: "Paulo Roberto",
                password: "senha123",
            },
            {
                id: 2,
                email: "ana@teste.com",
                nome: "Ana Carolina",
                password: "senha123",
            },
            {
                id: 3,
                email: "bruno@teste.com",
                nome: "Bruno Costa",
                password: "senha123",
            },
        ],
    });

    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT MAX(id) FROM "User"))`;

    token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
});

afterAll(async () => {
    if (prisma) {
        await prisma.$disconnect();
    }
});

describe("GET /status", () => {
    it("deve retornar status 200 e uma mensagem de status ok", async () => {
        const response = await request(app).get("/status");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "ok" });
    });
});

describe("GET /users", () => {
    it("deve retornar status 200 e uma lista de usuários", async () => {
        const response = await request(app)
            .get("/users")
            .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("nome");
    });
});

describe("GET /users/:id", () => {
    it("deve retornar um usuário específico e status 200", async () => {
        const response = await request(app)
            .get("/users/1")
            .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            nome: "Paulo Roberto",
            email: "paulo@teste.com",
        });
        expect(response.body).not.toHaveProperty("password");
    });

    it("deve retonar status 404 se o usuário não for encontrado", async () => {
        const response = await request(app)
            .get("/users/99")
            .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(404);
    });
});

describe("POST /users", () => {
    it("deve criar um novo usuário e retornar o objeto do usuário", async () => {
        const novoUsuario = {
            nome: "Carlos Andrade",
            email: "carlos@teste.com",
            password: "senhaForte123",
        };

        const response = await request(app)
            .post("/users")
            .set("Authorization", "Bearer " + token)
            .send(novoUsuario);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.nome).toBe("Carlos Andrade");
        expect(response.body.email).toBe("carlos@teste.com");
        expect(response.body).not.toHaveProperty("password");
    });

    it("deve retornar erro 400 se o nome não for fornecido", async () => {
        const response = await request(app)
            .post("/users")
            .set("Authorization", "Bearer " + token)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ erro: "O nome é obrigatório" });
    });
});

describe("PUT /users/:id", () => {
    it("deve atualizar o nome de um usuário e retorna-lo", async () => {
        const dadosAtualizados = {
            nome: "Paulo Ricardo",
            email: "paulo.ricardo@teste.com",
            password: "novaSenha123",
        };
        const response = await request(app)
            .put("/users/1")
            .set("Authorization", "Bearer " + token)
            .send(dadosAtualizados);

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.nome).toBe("Paulo Ricardo");
        expect(response.body.email).toBe("paulo.ricardo@teste.com");
        expect(response.body).not.toHaveProperty("password");
    });

    it("deve retornar 404 se o usuário não existir", async () => {
        const dadosAtualizados = { nome: "Usuário Fantasma" };
        const response = await request(app)
            .put("/users/99")
            .set("Authorization", "Bearer " + token)
            .send(dadosAtualizados);

        expect(response.statusCode).toBe(404);
    });

    it("deve retornar 400 se o nome não for fornecido no corpo", async () => {
        const response = await request(app)
            .put("/users/1")
            .set("Authorization", "Bearer " + token)
            .send({});

        expect(response.statusCode).toBe(400);
    });
});

describe("DELETE /users/:id", () => {
    it("deve remover um usuário e retornar status 204", async () => {
        const response = await request(app)
            .delete("/users/1")
            .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(204);

        const userCheckResponse = await request(app)
            .get("/users/1")
            .set("Authorization", "Bearer " + token);

        expect(userCheckResponse.statusCode).toBe(404);
    });

    it("deve retornar 404 se o usuário a ser deletado não existir", async () => {
        const response = await request(app)
            .delete("/users/99")
            .set("Authorization", "Bearer " + token);
        expect(response.statusCode).toBe(404);
    });
});
