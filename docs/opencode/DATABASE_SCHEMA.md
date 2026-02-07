# 데이터베이스 스키마 - Fantasy Builder

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0

---

## 개요 (Overview)

Fantasy Builder는 Drizzle ORM을 사용하는 스키마 우선(Schema-first) 설계를 기반으로 **이중 데이터베이스 아키텍처**를 사용합니다. 모든 엔티티는 일관된 패턴과 공통 감사(audit) 필드를 따르며, 로컬(SQLite) 및 원격(PostgreSQL) 배포를 모두 지원합니다.

---

## 설계 원칙 (Design Principles)

### 1. 공통 엔티티 패턴 (Common Entity Pattern)
모든 테이블은 공통 기본 구조를 확장합니다:
```sql
useYn     VARCHAR(1) NOT NULL DEFAULT 'Y'  -- 사용 여부 (Active/inactive)
shrnYn    VARCHAR(1) NOT NULL DEFAULT 'N'  -- 공유 여부
delYn     VARCHAR(1) NOT NULL DEFAULT 'N'  -- 소프트 삭제 여부
crtNo     INTEGER NOT NULL                   -- 생성자 ID
crtDt     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 생성 일시
updtNo    INTEGER NOT NULL                   -- 수정자 ID  
updtDt    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 수정 일시
delNo     INTEGER NULL                        -- 삭제자 ID
delDt     TIMESTAMP NULL                      -- 삭제 일시
```

### 2. 프로젝트 범위 (Project Scoping)
- **전역 엔티티 (Global Entities)**: `trait`, `abilities` - 모든 프로젝트에서 공유됨
- **프로젝트 엔티티 (Project Entities)**: `characters`, `creatures` 등 - 특정 프로젝트에 속함
- **매핑 테이블 (Mapping Tables)**: 프로젝트 컨텍스트를 포함한 다대다 관계

### 3. 소프트 삭제 (Soft Deletion)
모든 데이터는 감사 추적(Audit trail) 및 복구를 위해 `delYn` 플래그를 사용하여 보존됩니다.

---

## 핵심 테이블 (Core Tables)

### projects
모든 세계관 구축 프로젝트를 포함하는 중앙 엔티티입니다.

```sql
CREATE TABLE projects (
  prjNo      INTEGER PRIMARY KEY AUTOINCREMENT,
  userNo     INTEGER NULL,                    -- 원격 DB 전용
  prjNm      VARCHAR(255) NOT NULL,          -- 프로젝트 이름
  genreType  VARCHAR(100) NULL,              -- 장르 (판타지, SF 등)
  prjDesc    TEXT NULL,                      -- 짧은 설명
  cvrImgUrl  VARCHAR(500) NULL,              -- 커버 이미지 URL
  prjExpln   TEXT NULL,                      -- 상세 설명
  prjVer     VARCHAR(50) NULL,               -- 버전
  -- 공통 필드 (useYn, shrnYn, delYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)
);
```

---

## 전역 테이블 (Global Tables - 프로젝트 간 공유)

### traits
모든 프로젝트에서 사용할 수 있는 전역 특성 정의입니다.

```sql
CREATE TABLE traits (
  traitNo     INTEGER PRIMARY KEY AUTOINCREMENT,
  traitNm     VARCHAR(255) NOT NULL,         -- 특성 이름
  traitExpln  TEXT NULL,                     -- 특성 설명
  traitLcls   VARCHAR(100) NULL,             -- 대분류
  traitMcls   VARCHAR(100) NULL,             -- 중분류
  aplyTrgt    VARCHAR(255) NULL,             -- 적용 대상 (캐릭터, 크리처 등)
  cnflTraitNo INTEGER NULL,                  -- 상충 특성 (자기 참조)
  -- 공통 필드
);

-- 인덱스
CREATE INDEX idx_traits_name ON traits(traitNm);
CREATE INDEX idx_traits_category ON traits(traitLcls, traitMcls);
CREATE INDEX idx_traits_target ON traits(aplyTrgt);
```

### abilities
모든 프로젝트에서 사용할 수 있는 전역 능력 정의입니다.

```sql
CREATE TABLE abilities (
  abilityNo    INTEGER PRIMARY KEY AUTOINCREMENT,
  abilityNm    VARCHAR(255) NOT NULL,        -- 능력 이름
  abilityType  VARCHAR(100) NULL,            -- 능력 유형
  abilityLcls  VARCHAR(100) NULL,            -- 대분류
  abilityExpln TEXT NULL,                    -- 능력 설명
  trgtType     VARCHAR(100) NULL,            -- 대상 유형
  dmgType      VARCHAR(100) NULL,            -- 데미지 유형
  -- 공통 필드
);

-- 인덱스
CREATE INDEX idx_abilities_name ON abilities(abilityNm);
CREATE INDEX idx_abilities_type ON abilities(abilityType, abilityLcls);
```

---

## 프로젝트별 테이블 (Project-Specific Tables)

### project_traits
프로젝트별 특성 정의입니다.

```sql
CREATE TABLE project_traits (
  traitNo      INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- 프로젝트 참조
  traitNm      VARCHAR(255) NOT NULL,        -- 특성 이름
  traitExpln   TEXT NULL,                     -- 특성 설명
  traitLcls    VARCHAR(100) NULL,            -- 대분류
  traitMcls    VARCHAR(100) NULL,            -- 중분류
  aplyTrgt     VARCHAR(255) NULL,            -- 적용 대상
  cnflTraitNo  INTEGER NULL,                 -- 상충 특성
  cnflTraitType VARCHAR(10) NULL DEFAULT 'PROJECT', -- GLOBAL 또는 PROJECT
  -- 공통 필드
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### project_abilities
프로젝트별 능력 정의입니다.

```sql
CREATE TABLE project_abilities (
  abilityNo    INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- 프로젝트 참조
  abilityNm    VARCHAR(255) NOT NULL,        -- 능력 이름
  abilityType  VARCHAR(100) NULL,            -- 능력 유형
  abilityLcls  VARCHAR(100) NULL,            -- 대분류
  abilityExpln TEXT NULL,                    -- 능력 설명
  trgtType     VARCHAR(100) NULL,            -- 대상 유형
  dmgType      VARCHAR(100) NULL,            -- 데미지 유형
  -- 공통 필드
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### core_rules
프로젝트 핵심 규칙 및 설정입니다.

```sql
CREATE TABLE core_rules (
  coreNo      INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo       INTEGER NOT NULL,              -- 프로젝트 참조
  coreNm      VARCHAR(255) NOT NULL,         -- 핵심 규칙 이름
  coreExpln   TEXT NULL,                     -- 핵심 규칙 설명
  coreType    VARCHAR(100) NULL,             -- 핵심 규칙 유형
  -- 공통 필드
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### characters
프로젝트 내의 캐릭터 엔티티입니다.

```sql
CREATE TABLE characters (
  charNo       INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- 프로젝트 참조
  charNm       VARCHAR(255) NOT NULL,        -- 캐릭터 이름
  aliasNm      VARCHAR(255) NULL,            -- 이명/별명
  roleType     VARCHAR(100) NULL,            -- 역할 유형 (주인공, 적대자 등)
  logline      TEXT NULL,                     -- 한 줄 요약
  raceNo       INTEGER NULL,                 -- 종족/크리처 참조
  ntnNo        INTEGER NULL,                 -- 국가 참조
  orgNo        INTEGER NULL,                 -- 조직 참조
  -- 추가 캐릭터 필드 (나이, 성별, 외모 등)
  -- 공통 필드
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
  FOREIGN KEY (raceNo) REFERENCES creatures(creatureNo)
  FOREIGN KEY (ntnNo) REFERENCES nations(ntnNo)
  FOREIGN KEY (orgNo) REFERENCES organizations(orgNo)
);
```

### creatures
프로젝트 내의 크리처 및 종족 엔티티입니다.

```sql
CREATE TABLE creatures (
  creatureNo   INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- 프로젝트 참조
  creatureNm   VARCHAR(255) NOT NULL,        -- 크리처/종족 이름
  creatureType VARCHAR(100) NULL,            -- 크리처 유형
  creatureExpln TEXT NULL,                    -- 크리처 설명
  -- 추가 크리처 필드
  -- 공통 필드
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### items
프로젝트 내의 아이템 엔티티입니다.

```sql
CREATE TABLE items (
  itemNo       INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- 프로젝트 참조
  itemNm       VARCHAR(255) NOT NULL,        -- 아이템 이름
  itemType     VARCHAR(100) NULL,            -- 아이템 유형
  itemExpln    TEXT NULL,                     -- 아이템 설명
  -- 추가 아이템 필드 (희귀도, 속성 등)
  -- 공통 필드
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### regions
프로젝트 내의 지리적 지역입니다.

```sql
CREATE TABLE regions (
  regionNo     INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- 프로젝트 참조
  regionNm     VARCHAR(255) NOT NULL,        -- 지역 이름
  regionType   VARCHAR(100) NULL,            -- 지역 유형
  regionExpln  TEXT NULL,                     -- 지역 설명
  -- 공통 필드
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### nations
프로젝트 내의 정치적 실체(국가, 왕국)입니다.

```sql
CREATE TABLE nations (
  ntnNo        INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,
  -- 상세 내용 생략됨 (원본과 동일하게 유지)
);
```
