package com.memora.cosmetic.repository;

import com.memora.cosmetic.entity.CosmeticItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CosmeticItemRepository extends JpaRepository<CosmeticItem, UUID> {

    List<CosmeticItem> findByAtivoTrue();
}
