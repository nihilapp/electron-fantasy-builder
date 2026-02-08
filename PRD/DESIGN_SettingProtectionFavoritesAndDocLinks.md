# 설계: 문서 간 관계(링크), 설정 보호, 설정 즐겨찾기

> **목적:** 문서 간 관계를 링크로 다루는 방식 정리, 설정 보호/즐겨찾기용 테이블 설계 제안.

---

## 1. 문서 간 관계 (링크)

### 현재

- `core_rules.link_docs`(연관 설정): 텍스트 필드로 URL/경로 등 **문자열만** 저장.
- 단방향 “이 설정이 참조하는 문서”만 표현 가능.

### 링크로 구현할 때 선택지

| 방식 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **A. 기존 유지** | `link_docs`처럼 텍스트(URL/경로, 쉼표·줄단위 등)만 저장 | 구현 단순, 스키마 변경 없음 | 양방향·관계 조회·유형 구분 어렵움 |
| **B. 관계 테이블** | 전용 테이블로 “문서 A ↔ 문서 B” 관계 행 저장 | 양방향 조회, 다대다, 유형(참조/포함 등) 구분 가능 | 테이블·API·UI 추가 필요 |

**권장**

- **당장은 A 유지**: 이미 있는 `link_docs`로 “연관 문서 URL/경로”만 링크처럼 표시·입력.
- **나중에 “문서 간 관계”를 엔티티로 다루고 싶을 때 B 도입**:  
  예) `doc_links (from_category, from_no, to_category, to_no, link_type)` 형태로 확장.

즉, **지금은 링크를 “문자열(URL/경로)”로만 두고, 필요해지면 “관계 테이블”로 올리는 단계적 설계**가 무난합니다.

---

## 2. 설정 보호 / 설정 즐겨찾기 테이블

### 요구사항 정리

- **설정 보호**: 특정 설정 항목을 “보호” 처리(삭제/수정 제한 등).
- **설정 즐겨찾기**: 특정 설정 항목을 “즐겨찾기”로 등록.
- 설정은 **여러 종류** 존재: 코어 설정(core_rules), 프로젝트 어빌리티(project_abilities), 프로젝트 특성(project_traits), …  
  → 한 테이블이 “어떤 설정”을 가리킬지 **실제 FK로 걸기 어렵고**, **(카테고리 + 설정 번호)로 논리 참조**하는 방식이 맞음.

### 제안 구조

- **PK**: 보호 번호 / 즐겨찾기 번호 (각 테이블 1개).
- **설정 참조**: `(설정 카테고리, 설정 번호)`  
  - FK는 **걸지 않음** (여러 설정 테이블을 하나의 FK로 참조할 수 없음).  
  - **UNIQUE INDEX**는 `(prj_no, 설정 카테고리, 설정 번호)`로 두어, “한 프로젝트 안에서 같은 설정은 보호 1건, 즐겨찾기 1건”만 허용.
- **프로젝트 스코프**: 보호/즐겨찾기는 “프로젝트별”로 관리한다고 가정 → `prj_no` 필수, `prj_no` → `projects(prj_no)` 만 FK로 연결.

### 테이블 스키마 제안

#### 2.1 설정 보호 (setting_protections)

| 컬럼 | 타입 | 제약 | 비고 |
|------|------|------|------|
| protection_no | serial / int PK | PK | 보호 번호 |
| prj_no | int | NOT NULL, FK → projects(prj_no) | 프로젝트 번호 |
| setting_category | varchar | NOT NULL | 설정 카테고리 (예: CORE_RULE, PROJECT_ABILITY, PROJECT_TRAIT) |
| setting_no | int8 | NOT NULL | 해당 카테고리 내 설정 번호 |
| crt_dt | timestamp | NULL | 생성 일시 |
| crt_no | int8 | NULL | 생성자 (선택) |

- **UNIQUE(prj_no, setting_category, setting_no)**  
  → 한 프로젝트·한 설정당 보호 1건.

#### 2.2 설정 즐겨찾기 (setting_favorites)

| 컬럼 | 타입 | 제약 | 비고 |
|------|------|------|------|
| favorite_no | serial / int PK | PK | 즐겨찾기 번호 |
| prj_no | int | NOT NULL, FK → projects(prj_no) | 프로젝트 번호 |
| setting_category | varchar | NOT NULL | 설정 카테고리 |
| setting_no | int8 | NOT NULL | 설정 번호 |
| crt_dt | timestamp | NULL | 생성 일시 |
| crt_no | int8 | NULL | 생성자 (선택) |

- **UNIQUE(prj_no, setting_category, setting_no)**  
  → 한 프로젝트·한 설정당 즐겨찾기 1건.

### 카테고리 코드 예시

- `CORE_RULE` : core_rules.core_no  
- `PROJECT_ABILITY` : project_abilities.ability_no  
- `PROJECT_TRAIT` : project_traits.trait_no  
- (추가 설정 종류는 여기에 코드 추가)

### 정리

- **PK**: 보호 번호 / 즐겨찾기 번호.  
- **설정 참조**: (설정 카테고리, 설정 번호). **FK는 설정 쪽 테이블로 걸지 않음.**  
- **UNIQUE(prj_no, setting_category, setting_no)** 로 “한 설정당 1보호·1즐겨찾기” 보장.  
- `prj_no`만 FK로 두고, 나머지는 “논리적 참조”로 처리하는 구조가 적절합니다.

---

## 3. 다음 단계 제안

1. **문서 간 관계**  
   - 현 단계: `link_docs`(연관 설정)로 링크 문자열만 저장·표시 유지.  
   - 필요 시: `doc_links`(또는 유사) 관계 테이블 설계·도입 검토.

2. **설정 보호 / 즐겨찾기**  
   - 위 구조로 `setting_protections`, `setting_favorites` 테이블 추가.  
   - DDL·로컬/원격 스키마(drizzle 등) 반영 후, API·UI에서 “보호/즐겨찾기” 토글 시 이 테이블에 INSERT/DELETE.

이 문서를 기준으로 DDL·스키마 파일을 구체화하면 됩니다.
