package com.memora.shop.repository;

import com.memora.shop.entity.PurchaseHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PurchaseHistoryRepository extends JpaRepository<PurchaseHistory, UUID> {

    List<PurchaseHistory> findByUsuarioIdOrderByCompradoEmDesc(UUID usuarioId);
}
