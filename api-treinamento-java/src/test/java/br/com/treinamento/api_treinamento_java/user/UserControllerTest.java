package br.com.treinamento.api_treinamento_java.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser(username = "admin", roles = { "USER" })
public class UserControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private UserRepository userRepository;

        @Test
        public void deveListarTodosOsUsuarios() throws Exception {
                User user = new User();
                user.setNome("Usuario de Teste");
                user.setEmail("lista@teste.com");
                user.setPassword("senha123");
                userRepository.save(user);

                mockMvc.perform(get("/users"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$[0].nome").value("Usuario de Teste"));
        }

        @Test
        public void deveBuscarUsuarioPorIdComSucesso() throws Exception {
                User user = new User();
                user.setNome("Usuario Unico");
                user.setEmail("unico@teste.com");
                user.setPassword("senha123");
                User usuarioSalvo = userRepository.save(user);

                mockMvc.perform(get("/users/" + usuarioSalvo.getId()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.nome").value("Usuario Unico"));
        }

        @Test
        public void deveAtualizarUmUsuarioExistente() throws Exception {
                User user = new User();
                user.setNome("Nome Antigo");
                user.setEmail("antigo@teste.com");
                user.setPassword("senha123");
                User usuarioSalvo = userRepository.save(user);

                String jsonAtualizado = """
                                    {
                                        "nome": "Nome Novo",
                                        "email": "antigo@teste.com",
                                        "password": "senha123"
                                    }
                                """;

                mockMvc.perform(
                                put("/users/" + usuarioSalvo.getId())
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(jsonAtualizado))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.nome").value("Nome Novo"));
        }

        @Test
        public void deveDeletarUmUsuarioExistente() throws Exception {
                User user = new User();
                user.setNome("Usuario Para Deletar");
                user.setEmail("delete@teste.com");
                user.setPassword("senha123");
                User usuarioSalvo = userRepository.save(user);

                mockMvc.perform(delete("/users/" + usuarioSalvo.getId()))
                                .andExpect(status().isNoContent());
        }

}