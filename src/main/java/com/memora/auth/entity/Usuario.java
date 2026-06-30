package com.memora.auth.entity;

import com.memora.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Entidade do usuário. Implementa UserDetails para que o próprio
 * objeto de domínio seja usado diretamente pelo mecanismo de
 * autenticação do Spring Security, sem precisar de uma classe
 * adaptadora separada.
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario extends BaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 100)
    private String nome;

    /**
     * Nome de quem a usuária quer cuidar — usado para a IA personalizar
     * mensagens e referenciar a gata pelo nome (padrão: "Leia").
     */
    @Column(name = "nome_da_pet", length = 60)
    private String nomeDaPet;

    /**
     * Apenas o HASH da senha (BCrypt), nunca a senha em texto puro.
     */
    @Column(nullable = false)
    private String senhaHash;

    @Column(name = "cor_tema", length = 20)
    @Builder.Default
    private String corTema = "azul";

    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private boolean ativo = true;

    @Column(name = "token_recuperacao")
    private String tokenRecuperacao;

    @Column(name = "token_recuperacao_expira_em")
    private java.time.LocalDateTime tokenRecuperacaoExpiraEm;

    // ===== Métodos exigidos pela interface UserDetails =====

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return senhaHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return ativo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return ativo;
    }
}
