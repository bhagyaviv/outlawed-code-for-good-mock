package com.outlawed.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "previous_cases")
@Data
public class PreviousCase {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(name = "issue_type", nullable = false)
    private String issueType;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private String priority;

    @Column(columnDefinition = "TEXT")
    private String problem;

    @Column(name = "actions_taken", columnDefinition = "TEXT")
    private String actionsTaken;

    @Column(name = "knowledge_used", columnDefinition = "TEXT")
    private String knowledgeUsed;

    @Column(nullable = false)
    private String outcome;

    @Column(name = "resolution_summary", columnDefinition = "TEXT")
    private String resolutionSummary;

    @Column(columnDefinition = "TEXT")
    private String documents;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(name = "lessons_learned", columnDefinition = "TEXT")
    private String lessonsLearned;
}
