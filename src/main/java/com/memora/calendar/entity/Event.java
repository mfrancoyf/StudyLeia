package com.memora.calendar.entity;

import com.memora.auth.entity.Usuario;
import com.memora.common.entity.BaseEntity;
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

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoEvento tipo;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String descricao;

    /**
     * Marca se o alerta de proximidade já foi exibido/enviado, para
     * não repetir a mesma notificação em cada checagem do job
     * agendado.
     */
    @Column(name = "alerta_enviado", nullable = false)
    @Builder.Default
    private boolean alertaEnviado = false;
}
