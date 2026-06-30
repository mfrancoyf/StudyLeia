package com.memora.auth.service;

import com.memora.auth.dto.*;
import com.memora.auth.entity.Usuario;
import com.memora.auth.mapper.UsuarioMapper;
import com.memora.auth.repository.UsuarioRepository;
import com.memora.config.security.JwtService;
import com.memora.exception.CredenciaisInvalidasException;
import com.memora.exception.EmailJaCadastradoException;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.service.GamificationService;
import com.memora.gamification.service.StreakService;
import com.memora.garden.service.GardenService;
import com.memora.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Orquestra todo o ciclo de vida de autenticação. No cadastro, além
 * de criar o Usuario, já provisiona o estado inicial de gamificação
 * (UserProgress), o streak zerado e o estado inicial da Leia — assim
 * a usuária já entra na plataforma com a "gatinha filhote" esperando
 * por ela, em vez de uma tela vazia.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final GamificationService gamificationService;
    private final StreakService streakService;
    private final PetService petService;
    private final GardenService gardenService;
    private final JavaMailSender mailSender;

    @Transactional
    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EmailJaCadastradoException(request.email());
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email().toLowerCase().trim())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .nomeDaPet(request.nomeDaPet() != null && !request.nomeDaPet().isBlank()
                        ? request.nomeDaPet() : "Leia")
                .corTema("azul")
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);

        // Provisiona todo o estado inicial de gamificação numa única
        // transação — se algo falhar aqui, o cadastro inteiro é
        // revertido, evitando usuários "incompletos" no banco.
        gamificationService.criarParaUsuario(usuario);
        streakService.criarParaUsuario(usuario);
        petService.criarEstadoInicial(usuario);
        gardenService.criarParaUsuario(usuario);

        log.info("Novo usuário cadastrado: {}", usuario.getEmail());

        String token = jwtService.gerarToken(usuario);
        return new AuthResponse(token, usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getNomeDaPet());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email().toLowerCase().trim(), request.senha())
            );
        } catch (Exception ex) {
            throw new CredenciaisInvalidasException("E-mail ou senha inválidos");
        }

        Usuario usuario = usuarioRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new CredenciaisInvalidasException("E-mail ou senha inválidos"));

        String token = jwtService.gerarToken(usuario);
        return new AuthResponse(token, usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getNomeDaPet());
    }

    @Transactional
    public void solicitarRecuperacaoSenha(EsqueciSenhaRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email().toLowerCase().trim())
                .orElse(null);

        // Por segurança, não revelamos se o e-mail existe ou não na
        // base — a resposta para o frontend é sempre "ok, verifique seu
        // e-mail", independente do resultado.
        if (usuario == null) {
            log.info("Tentativa de recuperação de senha para e-mail não cadastrado: {}", request.email());
            return;
        }

        String token = UUID.randomUUID().toString();
        usuario.setTokenRecuperacao(token);
        usuario.setTokenRecuperacaoExpiraEm(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        enviarEmailRecuperacao(usuario, token);
    }

    @Transactional
    public void redefinirSenha(RedefinirSenhaRequest request) {
        Usuario usuario = usuarioRepository.findByTokenRecuperacao(request.token())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Token de recuperação inválido ou expirado."));

        if (usuario.getTokenRecuperacaoExpiraEm() == null
                || usuario.getTokenRecuperacaoExpiraEm().isBefore(LocalDateTime.now())) {
            throw new RecursoNaoEncontradoException("Token de recuperação inválido ou expirado.");
        }

        usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        usuario.setTokenRecuperacao(null);
        usuario.setTokenRecuperacaoExpiraEm(null);
        usuarioRepository.save(usuario);

        log.info("Senha redefinida com sucesso para o usuário {}", usuario.getEmail());
    }

    @Transactional(readOnly = true)
    public PerfilResponse obterPerfil(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));
        return usuarioMapper.toPerfilResponse(usuario);
    }

    @Transactional
    public PerfilResponse atualizarPerfil(UUID usuarioId, AtualizarPerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        if (request.nome() != null && !request.nome().isBlank()) {
            usuario.setNome(request.nome());
        }
        if (request.nomeDaPet() != null && !request.nomeDaPet().isBlank()) {
            usuario.setNomeDaPet(request.nomeDaPet());
        }
        if (request.corTema() != null && !request.corTema().isBlank()) {
            usuario.setCorTema(request.corTema());
        }

        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.toPerfilResponse(usuario);
    }

    private void enviarEmailRecuperacao(Usuario usuario, String token) {
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setTo(usuario.getEmail());
            mensagem.setSubject("Memora — Recuperação de senha");
            mensagem.setText("""
                    Oi, %s!

                    Recebemos uma solicitação para redefinir sua senha no Memora.

                    Use o código abaixo na tela de redefinição de senha:
                    %s

                    Esse código expira em 1 hora. Se você não solicitou isso, pode ignorar este e-mail.

                    A Leia está te esperando para continuar os estudos! 🐾
                    """.formatted(usuario.getNome(), token));
            mailSender.send(mensagem);
        } catch (Exception ex) {
            // Em ambiente de desenvolvimento local (XAMPP) é comum não
            // haver SMTP configurado. Não queremos que isso quebre o
            // fluxo de recuperação de senha — apenas logamos o token
            // para fins de teste manual.
            log.warn("Não foi possível enviar e-mail de recuperação (SMTP não configurado?). Token gerado para {}: {}",
                    usuario.getEmail(), token);
        }
    }
}
