# Windows Python Locations

이 문서는 `python-runtime-access` 스킬이 Windows 환경에서 Python 인터프리터를 찾고 실행할 때 참고하는 기준표다.

## 1. 우선 확인 순서

1. `Get-Command python -All`
2. `Get-Command py -All`
3. `where.exe python`
4. `$env:PATH`
5. 표준 설치 경로 `Test-Path`
6. 절대경로 실행
7. `Access is denied`면 escalation

## 2. 이 사용자 환경에서 먼저 볼 경로

### 우선 경로

```powershell
Test-Path 'C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe'
& 'C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe' --version
```

### 함께 볼 수 있는 경로

```powershell
Test-Path 'C:\Users\ahyne\AppData\Local\Programs\Python\Launcher\py.exe'
Test-Path 'C:\Users\ahyne\AppData\Local\Microsoft\WindowsApps\python.exe'
```

## 3. 스크립트 실행 예시

### skill initializer

```powershell
& 'C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe' 'C:\Users\ahyne\.codex\skills\.system\skill-creator\scripts\init_skill.py' my-skill --path '.agents/skills'
```

### skill validator

```powershell
& 'C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe' 'C:\Users\ahyne\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents/skills/my-skill'
```

### inline version check

```powershell
& 'C:\Users\ahyne\AppData\Local\Programs\Python\Python312\python.exe' --version
```

## 4. 해석 규칙

- `Test-Path`가 `True`면 설치 흔적은 있다.
- `Get-Command` 실패만으로 미설치라고 판단하지 않는다.
- 절대경로 실행이 `Access is denied`면 sandbox 권한 문제 가능성이 높다.
- 승인 후 같은 절대경로가 동작하면, 이후 명령도 같은 경로를 기준으로 실행한다.
