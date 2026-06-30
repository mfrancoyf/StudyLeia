package com.memora.auth.service;

import com.memora.auth.dto.LoginRequest;
import com.memora.auth.dto.RegistroRequest;
import com.memora.auth.entity.Usuario;
import com.memora.auth.mapper.UsuarioMapper;
import com.memora.auth.repository.UsuarioRepository;
import com.memora.config.security.JwtService;
import com.memora.exception.CredenciaisInvalidasException;
import com.memora.exception.EmailJaCadastradoException;
import com.memora.gamification.service.GamificationService;
import com.memora.gamification.service.StreakService;
import com.memora.garden.service.GardenService;
import com.memora.pet.service.PetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService — cadastro, login e perfil")
class AuthServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private UsuarioMapper usuarioMapper;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;
    @Mock private GamificationService gamificationService;
    @Mock private StreakService streakService;
    @Mock private PetService petService;
    @Mock private GardenService gardenService;
    @Mock private JavaMailSender mailSender;

    @InjectMocks
    private AuthService authService;

    private RegistroRequest registroRequest;

    @BeforeEach
    void configurar() {
        registroRequest = new RegistroRequest("Ana Laura", "ana@exemplo.com", "senha123", "Leia");
    }

    @Test
    @DisplayName("Cadastro feliz: cria usuário e provisiona gamificação, streak, pet e jardim")
    void cadastroFelizProvisionaTudo() {
        when(usuarioRepository.existsByEmail(registroRequest.email())).thenReturn(false);
        when(passwordEncoder.encode(registroRequest.senha())).thenReturn("hash-fake");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocacao -> {
            Usuario usuario = invocacao.getArgument(0);
            usuario.setId(UUID.randomUUID());
            return usuario;
        });
        when(jwtService.gerarToken(any(Usuario.class))).thenReturn("token-fake");

        var resultado = authService.registrar(registroRequest);

        assertThat(resultado.token()).isEqualTo("token-fake");
        assertThat(resultado.nome()).isEqualTo("Ana Laura");
        assertThat(resultado.nomeDaPet()).isEqualTo("Leia");

        verify(gamificationService).criarParaUsuario(any(Usuario.class));
        verify(streakService).criarParaUsuario(any(Usuario.class));
        verify(petService).criarEstadoInicial(any(Usuario.class));
        verify(gardenService).criarParaUsuario(any(Usuario.class));
    }

    @Test
    @DisplayName("Cadastro com e-mail já existente lança EmailJaCadastradoException e não provisiona nada")
    void cadastroComEmailDuplicadoLancaExcecao() {
        when(usuarioRepository.existsByEmail(registroRequest.email())).thenReturn(true);

        assertThatThrownBy(() -> authService.registrar(registroRequest))
                .isInstanceOf(EmailJaCadastradoException.class);

        verify(usuarioRepository, never()).save(any());
        verify(gamificationService, never()).criarParaUsuario(any());
    }

    @Test
    @DisplayName("Cadastro sem nome de pet informado usa 'Leia' como padrão")
    void cadastroSemNomeDePetUsaPadraoLeia() {
        RegistroRequest semNomeDaPet = new RegistroRequest("Maria", "maria@exemplo.com", "senha123", null);

        when(usuarioRepository.existsByEmail(semNomeDaPet.email())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hash");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocacao -> {
            Usuario usuario = invocacao.getArgument(0);
            usuario.setId(UUID.randomUUID());
            return usuario;
        });
        when(jwtService.gerarToken(any(Usuario.class))).thenReturn("token");

        var resultado = authService.registrar(semNomeDaPet);

        assertThat(resultado.nomeDaPet()).isEqualTo("Leia");
    }

    @Test
    @DisplayName("Login com credenciais inválidas lança CredenciaisInvalidasException")
    void loginComCredenciaisInvalidasLancaExcecao() {
        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException("Falha de autenticação"));

        LoginRequest loginRequest = new LoginRequest("ana@exemplo.com", "senha-errada");

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(CredenciaisInvalidasException.class);
    }

    @Test
    @DisplayName("Solicitação de recuperação de senha para e-mail inexistente não lança erro nem envia e-mail")
    void recuperacaoDeSenhaParaEmailInexistenteNaoFalha() {
        when(usuarioRepository.findByEmail("naoexiste@exemplo.com")).thenReturn(Optional.empty());

        authService.solicitarRecuperacaoSenha(new com.memora.auth.dto.EsqueciSenhaRequest("naoexiste@exemplo.com"));

        verify(mailSender, never()).send(any(org.springframework.mail.SimpleMailMessage.class));
        verify(usuarioRepository, never()).save(any());
    }
}
