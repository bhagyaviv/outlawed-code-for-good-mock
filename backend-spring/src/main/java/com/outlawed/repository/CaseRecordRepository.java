package com.outlawed.repository;

import com.outlawed.model.CaseRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRecordRepository extends JpaRepository<CaseRecord, Long> {
}
