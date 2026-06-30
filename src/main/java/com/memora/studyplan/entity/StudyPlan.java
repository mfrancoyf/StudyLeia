package com.memora.studyplan.entity;

import com.memora.auth.entity.Usuario;
import com.memora.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "study_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String materia;

    @Column(name = "data_prova", nullable = false)
    private LocalDate dataProva;

    @Column(name = "horas_disponiveis_por_dia", nullable = false)
    private double horasDisponiveisPorDia;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String resumo;

    @Column(nullable = false)
    @Builder.Default
    private boolean concluido = false;

    @OneToMany(mappedBy = "studyPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StudyPlanItem> itens = new ArrayList<>();

    public void adicionarItem(StudyPlanItem item) {
        itens.add(item);
        item.setStudyPlan(this);
    }
}
