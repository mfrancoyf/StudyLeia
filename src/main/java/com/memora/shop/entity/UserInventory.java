package com.memora.shop.entity;

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
 * Registro de posse: cada linha representa um item (cosmético ou
 * cenário) que o usuário já comprou e tem disponível para equipar.
 * O campo `equipado` marca qual item de cada tipo/categoria está
 * ativo no momento — só pode haver um cosmético equipado por
 * categoria e um cenário equipado por vez (regra aplicada na camada
 * de Service, não no banco).
 */
@Entity
@Table(name = "user_inventory", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "tipo_item", "item_ref_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_item", nullable = false, length = 20)
    private TipoItemLoja tipoItem;

    /**
     * Id do item no catálogo correspondente: CosmeticItem.id se
     * tipoItem=COSMETICO, ou BackgroundTheme.id se tipoItem=CENARIO.
     */
    @Column(name = "item_ref_id", nullable = false, columnDefinition = "CHAR(36)")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
    private UUID itemRefId;

    @Column(nullable = false)
    @Builder.Default
    private boolean equipado = false;

    @Column(name = "adquirido_em", nullable = false)
    private LocalDateTime adquiridoEm;

    @PrePersist
    public void prePersist() {
        if (adquiridoEm == null) {
            adquiridoEm = LocalDateTime.now();
        }
    }
}
