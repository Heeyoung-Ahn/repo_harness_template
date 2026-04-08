# Walkthrough

> Tester가 현재 iteration 또는 릴리즈 범위를 검증한 결과를 남기는 문서입니다.

## Quick Read
- 가장 최근 검증 결과:
- 이번에 검증한 Task ID:
- 이번에 확인한 요구사항:
- 검증 기준 Requirement Baseline:
- 문서/디자인 기준 사용자 기대 결과:
- 현재 green level과 branch freshness:
- optional runtime / boundary 결과:
- enterprise-governed verification gate:
- 남아 있는 release gate와 빌드 / 실행물 판단:
- dry-run / reporting evidence status:
- user-reported manual test status:
- user feedback handoff status:
- 다음 역할이 확인해야 할 포인트:

## Latest Result
- Result: Pass / Fail / Partial
- Iteration Pass: Yes / No
- Release Pass: Yes / No
- Code / Automation Pass: Yes / No
- Manual / Environment Pass: Yes / No / Pending
- Optional Runtime Boundary Pass: Yes / No / N/A
- Enterprise / Critical-Domain Verification: Yes / No / Pending / N/A
- Dry-Run / Reporting Evidence Status: Pending / Ready / Finalized / N/A
- Requirement Baseline Tested:
- Requirements Sync Check: Pass / Fail / Planner Update Needed
- Green Level Achieved: None / Targeted / Package / Workspace / Merge Ready
- Branch Freshness at Test Time: Fresh / Behind / Diverged / Not Checked
- User-Captured Manual Test Status: Not Needed / Waiting for User Results / Under Review / Finalized
- User Feedback Handoff Status: Pending / Ready / Sent / Not Needed
- Recommended Next Agent:
- Last Updated At: [YYYY-MM-DD HH:MM]

## Test Scope Snapshot
- Target version / milestone:
- Task IDs under test:
- Related requirements:
- Change requests covered:
- Optional packs / runtime contracts in scope:
- Read-only visibility / sidecar expectation:
- Expected user-visible outcome:

## User Report Alignment
사용자가 실기기 / 브라우저 / 운영 환경 테스트 결과를 긴 자유서술로 보내면, 바로 수정 지시나 blocker로 확정하지 말고 먼저 아래 형식으로 이해를 맞춥니다.

- Confirmation Status: Pending / Confirmed / Proceed Without Confirmation
- Observed Results (관찰된 결과):
- Requested Follow-up (사용자 요청 / 후속 요청):
- Needs Clarification (불명확 / 확인 필요):
- Confirmation asked: `Please confirm whether my understanding is correct. (내 이해가 맞는지 확인해 달라)`
- Proceed without confirmation basis:

## Feedback Capture Plan
- Expected user-visible outcome from docs / design:
- Feedback prompts for user:
- Priority reactions to probe: first impression / confusion / trust / copy / visual polish / missing expectation
- Raw feedback preservation plan:

## Changelog
- [YYYY-MM-DD] Tester: initial draft

## Environment

| Environment | Version / Device / Browser | Notes |
|---|---|---|
| Local | [예: Node 20 / Chrome / Android device] | [설명] |

## Build / Runtime Decision
- Existing build / artifact reusable: Yes / No / N/A
- New build / package required: Yes / No / N/A
- Optional runtime / boundary reused: Yes / No / N/A
- Basis:

## Branch Freshness
- Status: Fresh / Behind / Diverged / Not Checked
- Base branch:
- Checked at:
- Action taken:

## Failure Classification and Recovery
- Category: Requirement / Architecture / Branch / Build / Test / Review / Manual / Dependency / Deploy / External
- Impact: Iteration / Release / Docs Only
- Observed symptom:
- Attempted recovery:
- Next escalation:

## Commands Executed
```bash
# 실행한 검증 명령 기록
```

## Automated Test Results
- Result: Pass / Fail / Partial
- Details:
- Optional runtime / boundary:
- Enterprise / critical-domain verification:
- Dry-run / reporting verification:

## Manual Test Checklist

| Check Item | Expected Result | Reporter | Actual Result | Tester Assessment | Notes |
|---|---|---|---|---|---|
| [항목] | [기대 결과] | User / Tester | [실제 결과] | Pass / Fail / Pending | [메모] |

## User-Captured Manual Test Report
- Checklist prepared by:
- Test reporter: User / Tester / Pair
- Analysis status: Waiting for User Results / Under Review / Finalized
- Raw report source:
- Raw feedback preserved: Yes / No
- Detailed feedback location:
- Tester synthesis:

## Developer Feedback Handoff
- Handoff status: Pending / Ready / Sent
- Raw feedback source:
- Detailed feedback by screen / flow:
- Confirmed mismatches / bugs:
- Improvement ideas from user:
- Open product questions:
- Compression warning: 사용자 피드백은 한 줄 요약으로 축약하지 않고 관련 원문과 상세 메모를 함께 넘긴다.

## Session Notes Template
실기기 / 브라우저 / 운영 환경처럼 환경 의존 검증이 중요할 때는 아래 형식으로 최신 세션을 추가합니다.

### [YYYY-MM-DD HH:MM] [Tester Update Title]
- Preconditions:
- Commands run:
- Expected user outcome reviewed:
- Optional runtime / sidecar expectation:
- User raw notes (do not compress):
- Results:
- Tester interpretation:
- Feedback themes for Developer handoff:
- Remaining manual / environment checks:
- Assessment:

### User Report Alignment Example
```markdown
## 이해한 내용
- Observed Results (관찰된 결과)
  - `Settings > Update History`: 화면은 열리지만 스크롤이 안 된다고 이해했다.
- Requested Follow-up (사용자 요청 / 후속 요청)
  - Privacy Policy 또는 Recording Notice에 데이터 처리 설명을 더 분명히 적어 달라는 요청으로 이해했다.
- Needs Clarification (불명확 / 확인 필요)
  - 첨부 이미지 순서와 실제 화면 이름의 매핑이 필요하다.

Please confirm whether my understanding is correct. (내 이해가 맞는지 확인해 달라)
```

## Bugs / Mismatches Found

| ID | Severity | Description | Related Task / Requirement | Suggested Next Owner |
|---|---|---|---|---|
| BUG-01 | High | [설명] | [Task / Requirement] | Developer / Planner |

## Deferred / Out-of-Scope Requests
- [현재 계약과 분리한 신규 요청 또는 후속 제품 결정]
