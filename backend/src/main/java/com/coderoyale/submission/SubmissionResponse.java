package com.coderoyale.submission;

import java.util.List;

public class SubmissionResponse {
    private String submissionId;
    private SubmissionStatus status;
    private int passedTestCases;
    private int totalTestCases;
    private int executionTimeMs;
    private int memoryKb;
    private String compileOutput;
    private int damageDealt;
    private int xpEarned;
    private int mmrDelta;
    private List<TestCaseResultDto> testCaseResults;

    public static class TestCaseResultDto {
        private String id;
        private boolean passed;
        private String input;
        private String expected;
        private String actual;

        public TestCaseResultDto(String id, boolean passed, String input, String expected, String actual) {
            this.id = id;
            this.passed = passed;
            this.input = input;
            this.expected = expected;
            this.actual = actual;
        }

        public String getId() { return id; }
        public boolean isPassed() { return passed; }
        public String getInput() { return input; }
        public String getExpected() { return expected; }
        public String getActual() { return actual; }
    }

    public String getSubmissionId() { return submissionId; }
    public void setSubmissionId(String submissionId) { this.submissionId = submissionId; }

    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }

    public int getPassedTestCases() { return passedTestCases; }
    public void setPassedTestCases(int passedTestCases) { this.passedTestCases = passedTestCases; }

    public int getTotalTestCases() { return totalTestCases; }
    public void setTotalTestCases(int totalTestCases) { this.totalTestCases = totalTestCases; }

    public int getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(int executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public int getMemoryKb() { return memoryKb; }
    public void setMemoryKb(int memoryKb) { this.memoryKb = memoryKb; }

    public String getCompileOutput() { return compileOutput; }
    public void setCompileOutput(String compileOutput) { this.compileOutput = compileOutput; }

    public int getDamageDealt() { return damageDealt; }
    public void setDamageDealt(int damageDealt) { this.damageDealt = damageDealt; }

    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

    public int getMmrDelta() { return mmrDelta; }
    public void setMmrDelta(int mmrDelta) { this.mmrDelta = mmrDelta; }

    public List<TestCaseResultDto> getTestCaseResults() { return testCaseResults; }
    public void setTestCaseResults(List<TestCaseResultDto> testCaseResults) { this.testCaseResults = testCaseResults; }
}
