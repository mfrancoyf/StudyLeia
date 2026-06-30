package com.memora.shop.repository;

import com.memora.shop.entity.TipoItemLoja;
import com.memora.shop.entity.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserInventoryRepository extends JpaRepository<UserInventory, UUID> {

    List<UserInventory> findByUsuarioId(UUID usuarioId);

    List<UserInventory> findByUsuarioIdAndTipoItem(UUID usuarioId, TipoItemLoja tipoItem);

    Optional<UserInventory> findByUsuarioIdAndTipoItemAndItemRefId(UUID usuarioId, TipoItemLoja tipoItem, UUID itemRefId);

    boolean existsByUsuarioIdAndTipoItemAndItemRefId(UUID usuarioId, TipoItemLoja tipoItem, UUID itemRefId);
}
