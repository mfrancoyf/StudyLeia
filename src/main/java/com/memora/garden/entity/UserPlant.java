package com.memora.garden.entity;

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
 * Uma planta individual plantada num vasinho do jardim. Cresce
 * conforme três fatores combinados (ver GardenService.calcularEstagio):
 * tempo desde o plantio, XP total ganho pelo usuário desde então, e
 * número de metas/missões concluídas desde então — o que faz o
 * Jardim ser literalmente um reflexo visual do progresso de estudos,
 * não só um timer passivo.
 */
@Entity
@Table(name = "user_plants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPlant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garden_id", nullable = false)
    private Garden garden;

    @Column(name = "posicao_vaso", nullable = false)
    private int posicaoVaso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoPlanta tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstagioCrescimento estagio = EstagioCrescimento.SEMENTE;

    @Column(name = "plantada_em", nullable = false)
    private LocalDateTime plantadaEm;

    /**
     * Snapshot do XP total do usuário no momento do plantio — usado
     * para calcular quanto XP foi ganho "durante" o crescimento desta
     * planta específica, sem precisar de uma tabela de eventos extra.
     */
    @Column(name = "xp_no_plantio", nullable = false)
    private long xpNoPlantio;

    @Column(name = "metas_concluidas_no_plantio", nullable = false)
    private long metasConcluidasNoPlantio;

    @Column(nullable = false)
    @Builder.Default
    private boolean colhida = false;

    @PrePersist
    public void prePersist() {
        if (plantadaEm == null) {
            plantadaEm = LocalDateTime.now();
        }
    }
}
