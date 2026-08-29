package com.outlawed.repository;

import com.outlawed.model.CaseTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseTaskRepository extends JpaRepository<CaseTask, Long> {
}
