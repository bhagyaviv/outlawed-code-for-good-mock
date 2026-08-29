package com.outlawed.controller;

import com.outlawed.model.PreviousCase;
import com.outlawed.repository.PreviousCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/previous-cases")
public class PreviousCaseController {

    @Autowired
    private PreviousCaseRepository previousCaseRepository;

    @GetMapping
    public List<PreviousCase> getAllPreviousCases() {
        return previousCaseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PreviousCase> getPreviousCaseById(@PathVariable String id) {
        Optional<PreviousCase> caseOpt = previousCaseRepository.findById(id);
        return caseOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
