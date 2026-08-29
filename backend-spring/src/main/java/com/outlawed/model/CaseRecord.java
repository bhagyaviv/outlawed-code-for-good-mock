package com.outlawed.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "case_records")
@Data
@ToString(exclude = {"tasks", "notes"})
public class CaseRecord {

    @Id
    private Long id; // Explicit IDs (like 1056) are used

    @Column(nullable = false)
    private String title;

    @Column(name = "issue_type", nullable = false)
    private String issueType;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String urgency;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String language;

    @Column(name = "follow_up_date")
    private String followUpDate;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "client_age")
    private int clientAge;

    @Column(name = "client_phone")
    private String clientPhone;

    @Column(name = "file_name")
    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String situation;

    @Column(name = "expert_question", columnDefinition = "TEXT")
    private String expertQuestion;

    @Column(name = "expert_advisor")
    private String expertAdvisor;

    @Column(name = "expert_comments", columnDefinition = "TEXT")
    private String expertComments;

    @Column(name = "expert_answer_date")
    private String expertAnswerDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "last_updated")
    private String lastUpdated;

    @OneToMany(mappedBy = "caseRecord", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<CaseTask> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "caseRecord", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<CaseNote> notes = new ArrayList<>();
}
