package com.outlawed.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "case_tasks")
@Data
@ToString(exclude = "caseRecord")
public class CaseTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private CaseRecord caseRecord;

    @Column(nullable = false)
    private String title;

    @Column(name = "due_date")
    private String dueDate;

    @Column(nullable = false)
    private boolean done = false;
}
