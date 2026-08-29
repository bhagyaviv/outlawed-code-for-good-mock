package com.outlawed.controller;

import com.outlawed.model.CaseRecord;
import com.outlawed.model.CaseNote;
import com.outlawed.model.CaseTask;
import com.outlawed.repository.CaseRecordRepository;
import com.outlawed.repository.CaseNoteRepository;
import com.outlawed.repository.CaseTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    @Autowired
    private CaseRecordRepository caseRecordRepository;

    @Autowired
    private CaseNoteRepository caseNoteRepository;

    @Autowired
    private CaseTaskRepository caseTaskRepository;

    @GetMapping
    public List<CaseRecord> getAllCases() {
        return caseRecordRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaseRecord> getCaseById(@PathVariable Long id) {
        Optional<CaseRecord> caseOpt = caseRecordRepository.findById(id);
        return caseOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CaseRecord> createCase(@RequestBody CaseRecord newCase) {
        // Calculate the next case ID to maintain the OutLawed format (1072, 1073...)
        long maxId = caseRecordRepository.findAll().stream()
                .mapToLong(CaseRecord::getId)
                .max()
                .orElse(1000);
        newCase.setId(maxId + 1);

        if (newCase.getStatus() == null) {
            newCase.setStatus("Active");
        }
        if (newCase.getLastUpdated() == null) {
            newCase.setLastUpdated(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        }

        // Save parent
        CaseRecord saved = caseRecordRepository.save(newCase);

        // Save nested initial tasks if present
        if (newCase.getTasks() != null) {
            for (CaseTask task : newCase.getTasks()) {
                task.setCaseRecord(saved);
                caseTaskRepository.save(task);
            }
        }

        // Re-fetch to load fully
        return ResponseEntity.status(HttpStatus.CREATED).body(caseRecordRepository.findById(saved.getId()).orElse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaseRecord> updateCase(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<CaseRecord> caseOpt = caseRecordRepository.findById(id);
        if (!caseOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        CaseRecord record = caseOpt.get();

        // Update fields if present in maps
        if (updates.containsKey("status")) {
            record.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("urgency")) {
            record.setUrgency((String) updates.get("urgency"));
        }
        if (updates.containsKey("followUpDate")) {
            record.setFollowUpDate((String) updates.get("followUpDate"));
        }
        if (updates.containsKey("expertQuestion")) {
            record.setExpertQuestion((String) updates.get("expertQuestion"));
        }
        if (updates.containsKey("expertAdvisor")) {
            record.setExpertAdvisor((String) updates.get("expertAdvisor"));
        }
        if (updates.containsKey("expertComments")) {
            record.setExpertComments((String) updates.get("expertComments"));
        }
        if (updates.containsKey("expertAnswerDate")) {
            record.setExpertAnswerDate((String) updates.get("expertAnswerDate"));
        }

        record.setLastUpdated(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        CaseRecord updated = caseRecordRepository.save(record);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<CaseNote> addNote(@PathVariable Long id, @RequestBody Map<String, String> noteData) {
        Optional<CaseRecord> caseOpt = caseRecordRepository.findById(id);
        if (!caseOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        CaseNote note = new CaseNote();
        note.setCaseRecord(caseOpt.get());
        note.setText(noteData.get("text"));
        note.setAuthor(noteData.get("author"));
        note.setCreatedAt(new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm").format(new java.util.Date()));

        CaseNote savedNote = caseNoteRepository.save(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<?> toggleTask(@PathVariable Long taskId, @RequestBody Map<String, Boolean> payload) {
        Optional<CaseTask> taskOpt = caseTaskRepository.findById(taskId);
        if (!taskOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        CaseTask task = taskOpt.get();
        if (payload.containsKey("done")) {
            task.setDone(payload.get("done"));
        }
        caseTaskRepository.save(task);
        return ResponseEntity.ok(Map.of("message", "Task toggled successfully"));
    }
}
