package br.com.treinamento.api_treinamento_java.user;

import br.com.treinamento.api_treinamento_java.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void deveCriarUmNovoUsuarioComSucesso() throws Exception {
        String novoUsuarioJson = "{\"nome\": \"Usuário de Teste\"}";

        mockMvc.perform(
                post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(novoUsuarioJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Usuário de Teste"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    public void deveListarTodosOsUsuarios() throws Exception {
        User user = new User();
        user.setNome("Usuario de Teste");
        userRepository.save(user);

        mockMvc.perform(
                get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].nome").value("Usuario de Teste"));
    }

    @Test
    public void deveBuscarUsuarioPorIdComSucesso() throws Exception {
        User user = new User();
        user.setNome("Usuario Unico");
        User usuarioSalvo = userRepository.save(user);
        Integer idSalvo = usuarioSalvo.getId();

        mockMvc.perform(
                get("/users/" + idSalvo))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(idSalvo))
                .andExpect(jsonPath("$.nome").value("Usuario Unico"));
    }

    @Test
    public void deveRetornar404AoBuscarUsuarioInexistente() throws Exception {
        mockMvc.perform(
                get("/users/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void deveAtualizarUmUsuarioExistente() throws Exception {
        User user = new User();
        user.setNome("Nome Antigo");
        User usuarioSalvo = userRepository.save(user);
        Integer idSalvo = usuarioSalvo.getId();
        String jsonAtualizado = "{\"nome\": \"Nome Novo\"}";

        mockMvc.perform(
                put("/users/" + idSalvo)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonAtualizado))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Nome Novo"));
    }

    @Test
    public void deveDeletarUmUsuarioExistente() throws Exception {
        User user = new User();
        user.setNome("Usuario Para Deletar");
        User usuarioSalvo = userRepository.save(user);
        Integer idSalvo = usuarioSalvo.getId();

        mockMvc.perform(
                delete("/users/" + idSalvo))
                .andExpect(status().isNoContent());

        mockMvc.perform(
                get("/users/" + idSalvo))
                .andExpect(status().isNotFound());
    }
}