package com.outlawed.repository;

import com.outlawed.model.CaseNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseNoteRepository extends JpaRepository<CaseNote, Long> {
}
