package com.memora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Ponto de entrada da aplicação Memora — Leia Edition.
 *
 * @EnableScheduling habilita as tarefas agendadas usadas, por exemplo,
 * para verificar streaks quebrados (usuário não estudou no dia) e
 * disparar alertas de eventos próximos do calendário.
 */
@SpringBootApplication
@EnableScheduling
public class MemoraApplication {

    public static void main(String[] args) {
        SpringApplication.run(MemoraApplication.class, args);
    }
}
