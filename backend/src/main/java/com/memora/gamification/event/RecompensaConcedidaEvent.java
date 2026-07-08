package com.memora.gamification.event;

import java.util.UUID;

/**
 * Disparado pelo GamificationService sempre que uma recompensa é
 * concedida com sucesso. Outros módulos que precisam reagir a "a
 * usuária ganhou XP/moedas agora" (como o Jardim, que credita
 * sementes) escutam este evento via @EventListener, em vez de o
 * GamificationService depender diretamente deles — isso evita ciclos
 * de dependência entre módulos.
 */
public record RecompensaConcedidaEvent(UUID usuarioId) {
}
