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
 * Registro histórico e imutável de cada compra realizada — distinto
 * do UserInventory (que reflete o estado atual de posse/equipagem).
 * Guardamos o nome e preço pago "congelados" no momento da compra,
 * para o histórico continuar correto mesmo que o preço do item
 * mude depois no catálogo.
 */
@Entity
@Table(name = "purchase_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseHistory {

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

    @Column(name = "item_ref_id", nullable = false, columnDefinition = "CHAR(36)")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
    private UUID itemRefId;

    @Column(name = "nome_item", nullable = false, length = 100)
    private String nomeItem;

    @Column(name = "preco_pago", nullable = false)
    private long precoPago;

    @Column(name = "comprado_em", nullable = false)
    private LocalDateTime compradoEm;

    @PrePersist
    public void prePersist() {
        if (compradoEm == null) {
            compradoEm = LocalDateTime.now();
        }
    }
}
