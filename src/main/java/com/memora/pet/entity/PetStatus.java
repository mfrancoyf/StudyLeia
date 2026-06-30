package com.memora.pet.entity;

import com.memora.auth.entity.Usuario;
import com.memora.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Representa o estado emocional/visual da Leia (a pet virtual) para
 * um usuário específico. É essa entidade que guarda o "humor" atual,
 * usado pelo Dashboard e pelas animações no frontend.
 *
 * O humor é recalculado pelo PetService com base em:
 *  - há quanto tempo o usuário não estuda (humor cai com o tempo);
 *  - streak ativo (humor sobe);
 *  - XP ganho recentemente (reação imediata e passageira).
 */
@Entity
@Table(name = "pet_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetStatus extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "nome_pet", length = 60)
    @Builder.Default
    private String nomePet = "Leia";

    @Enumerated(EnumType.STRING)
    @Column(name = "humor", nullable = false, length = 20)
    @Builder.Default
    private HumorPet humor = HumorPet.FELIZ;

    /**
     * Estágio visual de evolução da Leia (filhote -> adulta -> rainha
     * majestosa...). Calculado a partir do nível de gamificação do
     * usuário, mas guardado aqui para permitir consultas diretas e
     * eventuais regras futuras de evolução desacopladas do nível puro.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "estagio_evolucao", nullable = false, length = 20)
    @Builder.Default
    private EstagioEvolucao estagioEvolucao = EstagioEvolucao.FILHOTE;

    @Column(name = "ultima_interacao_em")
    private java.time.LocalDateTime ultimaInteracaoEm;

    /**
     * Quantidade de "carinhos" (cliques de interação direta na Leia,
     * sem necessariamente gerar XP) acumulados. Usado em pequenas
     * variações de humor e numa conquista futura.
     */
    @Column(name = "total_carinhos", nullable = false)
    @Builder.Default
    private int totalCarinhos = 0;
}
