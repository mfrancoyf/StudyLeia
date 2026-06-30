package com.memora.focus.entity;

import com.memora.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Registro de uma sessão do Modo Foco (Pomodoro) concluída. O timer
 * em si (contagem 25min foco / 5min pausa) é controlado no frontend
 * via JavaScript puro — o backend só recebe a confirmação de
 * conclusão para fins de XP e estatística de minutos estudados.
 */
@Entity
@Table(name = "focus_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FocusSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoSessaoFoco tipo;

    @Column(name = "duracao_minutos", nullable = false)
    private int duracaoMinutos;

    @Column(name = "concluida_em", nullable = false)
    private LocalDateTime concluidaEm;

    @PrePersist
    public void prePersist() {
        if (concluidaEm == null) {
            concluidaEm = LocalDateTime.now();
        }
    }
}
