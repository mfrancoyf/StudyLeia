package com.memora.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuração central de segurança. Define:
 *  - Quais rotas são públicas (login, registro, assets estáticos,
 *    Swagger) e quais exigem autenticação (todo o resto do app);
 *  - Que a aplicação não usa sessão HTTP tradicional (STATELESS),
 *    já que a autenticação é feita via JWT em cada requisição;
 *  - O filtro JwtAuthFilter entra ANTES do filtro padrão de
 *    usuário/senha do Spring Security.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UsuarioDetailsService usuarioDetailsService;
    private final ApiAwareAuthEntryPoint apiAwareAuthEntryPoint;

    /**
     * Assets estáticos que continuam liberados (favicon direto do backend,
     * se algum dia servido; caso contrário este array fica vazio e pode
     * ser removido). A aplicação NÃO serve mais páginas HTML — o único
     * front-end é a SPA React, hospedada separadamente (ver frontend/).
     */
    private static final String[] ROTAS_PUBLICAS_API = {
            "/api/auth/**",
            "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // API stateless com JWT; CSRF não se aplica do mesmo jeito que em sessão por cookie de sessão tradicional
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOriginPatterns(java.util.List.of("*"));
                    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(java.util.List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(ROTAS_PUBLICAS_API).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(eh -> eh
                        // API 100% stateless: qualquer requisição não autenticada
                        // recebe 401 em JSON — não há mais página de login no backend.
                        .authenticationEntryPoint(apiAwareAuthEntryPoint)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(usuarioDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
