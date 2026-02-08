# Protocol: Anti-Gravity Plan & Result (Smart Workflow)

> **Purpose:** To enforce a structured workflow for code modifications while allowing flexibility for simple tasks.
> **Role:** Anti-Gravity Agent (Advanced AI Developer)

---

## 🚀 MASTER RULE: The Smart Protocol

For requests involving code generation, modification, or refactoring, follow this decision logic to determine if a formal Plan & Result process is required.

### 🧠 Decision Logic (Trigger & Skip)

1.  **Explicit Command (Highest Priority)**:
    *   **"이슈 생성해", "이슈 만들어"**: MUST create a Plan/Result.
    *   **"플랜 만들지 마", "단순 수정이야"**: Document changes in chat only (Skip Plan/Result).

2.  **Complexity Check (If no explicit command)**:
    *   **CREATE Plan/Result if**:
        *   Modifying multiple files.
        *   Structural/Architectural changes.
        *   High impact or risky changes.
        *   Unsure about the complexity.
    *   **SKIP Plan/Result if**:
        *   Single file modification (Simple fix).
        *   Typo fixes, comment updates.
        *   Straightforward refactoring without logic change.

---

### 📁 Directory Structure

Plan and Result files are stored in the **same folder** under **PRD/plans/**.

```
PRD/
└── plans/
    └── YYYY-MM-DD/
        ├── {Seq}_{Type}_{Keyword}_PLAN.md
        └── {Seq}_{Type}_{Keyword}_RESULT.md
```

*Do not use a separate results/ folder. Place RESULT files in the same date folder as the corresponding PLAN.*

### 🏷️ Identifiers & Types

*   **Format**: `{Seq}_{Type}_{Keyword}`
*   **{Seq}**: Sequence number (001, 002...) for the day.
*   **{Type}**:
    *   `UPDATE`: Feature implementation, refactoring, general changes.
    *   `ERROR`: Bug fixes, error resolution.
*   **{Keyword}**: PascalCase English keyword (e.g., `FixLogin`).

---

## STEP 1: PLAN (Before Coding)

**Only if triggered by the logic above.**

1.  **Preparation**: Analyze requirements and context.
2.  **Create Plan File**:
    *   **Path**: `./PRD/plans/{YYYY-MM-DD}/{Seq}_{Type}_{Keyword}_PLAN.md`
    *   **Template**:
        ```markdown
        # PLAN: [Title]
        > **Date:** YYYY-MM-DD
        > **Task ID:** {Seq}_{Type}_{Keyword}
        > **Language:** Korean (Required)

        ## 1. Objective
        (Summary of the goal)

        ## 2. Context Analysis
        - **Target Files:** ...
        - **Current Issue:** ...

        ## 3. Strategy
        (Technical approach, logic, patterns)

        ## 4. Impact Analysis
        - **Affected Files:** ...
        - **Side Effects:** ...

        ## 5. Task List
        - [ ] ...

        ## 6. Verification Plan
        (Verification steps)
        ```
3.  **Approval**: Ask: **"마스터, `[ {Seq}_{Type}_{Keyword}_PLAN.md ]` 계획을 수립했습니다. 진행하겠습니까?"**

---

## STEP 2: EXECUTION

1.  **Wait for Approval** (if Plan was created).
2.  **Execute**: Follow the task list.
3.  **Error Handling**: If `ERROR` type, ensure the root cause is addressed.

---

## STEP 3: RESULT (After Coding)

**Only if a Plan was created.**

1.  **Verify Result**: 실행 결과를 확인한다.

2.  **Self-Check Checklist (필수, 매우 중요)**  
    **결과 문서(RESULT)를 작성하기 전에 반드시 수행한다.**

    *   **PLAN 파일 재열람**: 해당 PLAN의 **§5 Task List**와 **§6 Verification Plan** 항목을 모두 꺼낸다.
    *   **항목별 검증**: 각 항목에 대해 코드·파일·동작을 실제로 확인한 뒤,
        *   완료·검증됨 → **`[x]`** 로 표시
        *   미완료 또는 미검증 → **`[ ]`** (또는 x) 로 표시
    *   **진행 제한**:
        *   **모든 체크리스트 항목이 `[x]`가 될 때까지** RESULT 문서를 작성하지 않는다.
        *   하나라도 `[ ]`가 남아 있으면: 남은 작업을 수행하거나, 마스터에게 "체크리스트 미충족"을 보고하고 RESULT 작성을 보류한다.
    *   **진행 허용**: 전부 `[x]`가 된 경우에만 다음 단계(Result File 생성)로 진행한다.

3.  **Create Result File** (체크리스트 전부 통과 후, PLAN과 같은 폴더에 생성):
    *   **Path**: `./PRD/plans/{YYYY-MM-DD}/{Seq}_{Type}_{Keyword}_RESULT.md`
    *   **Template**:
        ```markdown
        # RESULT: [Title]
        > **Date:** YYYY-MM-DD
        > **Task ID:** {Seq}_{Type}_{Keyword}
        > **Status:** ✅ SUCCESS / ❌ FAILURE
        > **Language:** Korean

        ## 1. Execution Summary
        ...

        ## 2. Modified Files
        - [Modified] ...

        ## 3. Key Changes
        - ...

        ## 4. Verification Results
        ...
        ```

4.  **Final Report**: 사용자에게 완료를 알린다.

---

## 🧠 Guidelines

*   **Language**: Korean for Plans/Results/Comments. English for filenames.
*   **Proactiveness**: Verify assumptions before planning.
