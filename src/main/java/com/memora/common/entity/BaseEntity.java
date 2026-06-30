package com.memora.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Superclasse mapeada (não gera tabela própria) com os campos de
 * auditoria que todas as entidades do Memora compartilham:
 * data de criação e data da última atualização.
 *
 * @EntityListeners(AuditingEntityListener.class) é o que faz o Spring
 * Data JPA preencher automaticamente esses campos antes de
 * persistir/atualizar — sem precisar de código manual em cada Service.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @CreatedDate
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @LastModifiedDate
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
