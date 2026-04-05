---
name: python-runtime-access
description: Windows 워크스페이스에서 Python이 설치되어 있는데도 `python` 또는 `py` 명령이 실패할 때 인터프리터를 찾고 실행 권한 문제를 해소하는 스킬. Python 스크립트 실행, skill initializer/validator 실행, 로컬 자동화, 툴링 검증이 필요한데 `CommandNotFoundException`, `where.exe` 미발견, 또는 `Access is denied`가 발생할 때 사용한다.
---

# Python Runtime Access

이 스킬은 Windows 기반 Codex 작업 환경에서 Python 설치 여부와 무관하게 실제 실행 가능한 인터프리터를 찾아 쓰는 절차를 제공한다.

핵심 원칙:
- `python`이나 `py`가 실패해도 바로 미설치로 결론내리지 않는다.
- 먼저 `PATH`, 절대경로, 표준 설치 위치를 확인한다.
- 절대경로 실행이 `Access is denied`로 막히면 sandbox 제약으로 보고 즉시 승인 요청으로 전환한다.

## 빠른 적용 대상

다음 상황이면 이 스킬을 사용한다.

- `python --version` 또는 `py -3 --version`이 실패한다.
- `where.exe python`이 아무 경로도 찾지 못한다.
- Python 스크립트 실행 시 `Access is denied` 또는 유사한 권한 오류가 난다.
- `init_skill.py`, `quick_validate.py`, 프로젝트 내 Python 유틸리티를 실행해야 한다.
- 이전 세션에서 "Python이 없다"는 오진이 반복되었다.

## 작업 순서

### 1. PATH와 기본 명령을 먼저 확인한다

- `Get-Command python -All`
- `Get-Command py -All`
- `where.exe python`
- `$env:PATH`

명령이 안 잡혀도 바로 종료하지 않는다. `PATH` 안에 Python 디렉터리가 있을 수 있고, sandbox가 실행만 막는 경우가 있다.

### 2. 절대경로 후보를 확인한다

- 이 워크스페이스에서 우선 확인할 기준 경로와 명령은 [windows-python-locations.md](./references/windows-python-locations.md)를 따른다.
- `Test-Path`로 실제 파일 존재를 본다.
- 가능하면 런처보다 `python.exe` 절대경로를 우선 사용한다.

### 3. 절대경로로 직접 실행한다

- 예: `& 'C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe' --version`
- 예: `& 'C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe' 'path\\to\\script.py' ...`

이 단계에서 성공하면 이후 Python 작업은 같은 절대경로를 재사용한다.

### 4. `Access is denied`면 sandbox 이슈로 처리한다

- 설치 문제로 단정하지 않는다.
- 사용자에게 미리 일반 텍스트로 물어보지 말고, 승인 요청이 필요한 명령을 바로 escalation으로 재시도한다.
- justification에는 Python 기반 도구를 왜 실행해야 하는지만 짧게 적는다.
- 가능하면 인터프리터 경로와 스크립트 경로를 모두 절대경로로 고정한다.

### 5. 실행 후 기록을 남긴다

- 어떤 절대경로가 실제로 동작했는지 남긴다.
- 실패 원인이 `미설치`인지 `PATH 문제`인지 `sandbox 권한`인지 구분한다.
- 같은 세션 안에서는 다시 추측하지 말고 검증된 절대경로를 계속 사용한다.

## 이 워크스페이스에서 이미 확인된 사실

- `PATH`에는 `C:\Users\ahyne\AppData\Local\Programs\Python\Python312\`가 들어 있다.
- `python`과 `py`는 셸에서 바로 해석되지 않을 수 있다.
- `C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe`는 존재한다.
- sandbox 안 직접 실행은 `Access is denied`가 날 수 있다.
- 승인 후 절대경로 실행으로 `Python 3.12.10` 동작을 확인했다.

## 금지 사항

- `python` 또는 `py`가 실패했다는 이유만으로 Python 미설치라고 말하지 않는다.
- PATH만 보고 실제 실행 검증 없이 결론내리지 않는다.
- 권한 오류를 설치 오류처럼 설명하지 않는다.
- 이미 검증된 절대경로가 있는데 다시 무작정 전체 디스크를 뒤지지 않는다.

## 리소스

- Windows 경로 우선순위와 실행 예시: [windows-python-locations.md](./references/windows-python-locations.md)
