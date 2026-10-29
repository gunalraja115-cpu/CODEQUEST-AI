package com.coderoyale.auth;

import com.coderoyale.rank.Rank;
import com.coderoyale.rank.RankRepository;
import com.coderoyale.rank.UserRating;
import com.coderoyale.rank.UserRatingRepository;
import com.coderoyale.user.User;
import com.coderoyale.user.UserProfile;
import com.coderoyale.user.UserProfileRepository;
import com.coderoyale.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RankRepository rankRepository;

    @BeforeEach
    void setUp() {
        // Ensure bronze rank exists for test registration
        if (!rankRepository.existsById("bronze")) {
            rankRepository.save(new Rank("bronze", "Bronze", 1, 0, 999, "🛡️", "#cd7f32"));
        }
    }

    @Test
    void healthEndpointReturnsUp() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void registerNewUserSuccessfully() throws Exception {
        String json = """
            {
                "username": "TestGladiator",
                "email": "test@coderoyale.io",
                "password": "password123",
                "avatarClass": "Cyber Shinobi"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("TestGladiator"))
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }

    @Test
    void registerDuplicateUsernameReturnsBadRequest() throws Exception {
        String json = """
            {
                "username": "DuplicateGladiator",
                "email": "first@coderoyale.io",
                "password": "password123"
            }
            """;

        // Register first time
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        // Same username, different email — should fail
        String json2 = """
            {
                "username": "DuplicateGladiator",
                "email": "second@coderoyale.io",
                "password": "password123"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json2))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginWithValidCredentialsReturnsJwt() throws Exception {
        // Register first
        String reg = """
            {
                "username": "LoginTester",
                "email": "login@coderoyale.io",
                "password": "securePass99"
            }
            """;
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(reg))
                .andExpect(status().isOk());

        // Login
        String login = """
            {
                "username": "LoginTester",
                "password": "securePass99"
            }
            """;
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(login))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }

    @Test
    void loginWithWrongPasswordReturnsUnauthorized() throws Exception {
        String login = """
            {
                "username": "NonExistent",
                "password": "wrongpass"
            }
            """;
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(login))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registerWithBlankUsernameFailsValidation() throws Exception {
        String json = """
            {
                "username": "",
                "email": "test@example.com",
                "password": "password123"
            }
            """;
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }
}
