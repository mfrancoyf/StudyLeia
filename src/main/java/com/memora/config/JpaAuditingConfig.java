package com.memora.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Habilita o preenchimento automático dos campos @CreatedDate e
 * @LastModifiedDate em todas as entidades que estendem BaseEntity.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
