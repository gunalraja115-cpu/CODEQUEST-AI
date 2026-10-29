package com.coderoyale.submission;

import com.coderoyale.common.ApiResponse;
import com.coderoyale.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/run")
    public ResponseEntity<ApiResponse<SubmissionResponse>> runCode(
            @Valid @RequestBody SubmissionRequest req,
            @AuthenticationPrincipal User user) {
        SubmissionResponse res = submissionService.runCode(req, user);
        return ResponseEntity.ok(ApiResponse.ok("Code executed in isolated sandbox", res));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submit(
            @Valid @RequestBody SubmissionRequest req,
            @AuthenticationPrincipal User user) {
        SubmissionResponse res = submissionService.submit(req, user);
        return ResponseEntity.ok(ApiResponse.ok("Solution evaluated against official test suite", res));
    }
}
