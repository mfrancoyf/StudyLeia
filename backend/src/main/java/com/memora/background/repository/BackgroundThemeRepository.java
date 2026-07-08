package com.memora.background.repository;

import com.memora.background.entity.BackgroundTheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BackgroundThemeRepository extends JpaRepository<BackgroundTheme, UUID> {

    List<BackgroundTheme> findByAtivoTrue();
}
