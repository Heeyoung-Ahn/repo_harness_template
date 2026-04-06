# Path Matrix

## 1. self-hosting only

대상:

- root `AGENTS.md`
- root `.agents/artifacts/*`
- root 전용 운영 스킬

수정 위치:

- root만

rollout:

- 없음

## 2. shared starter-bound source

대상:

- `templates_starter/.agents/rules/*`
- `templates_starter/.agents/workflows/*`
- `templates_starter/.agents/scripts/*`
- `templates_starter/.agents/skills/*`

수정 위치:

- starter canonical source
- 필요 시 root 대응 source

rollout:

```powershell
& ".agents/scripts/sync_template_docs.ps1" -Preset "active_operating_projects"
```

## 3. shared skill mirrored in root and starter

대상 예:

- root `.agents/skills/expo_real_device_test/*`
- starter `templates_starter/.agents/skills/expo_real_device_test/*`

수정 위치:

1. root canonical skill source
2. starter canonical skill source

rollout:

```powershell
& ".agents/scripts/sync_template_docs.ps1" -Preset "active_operating_projects"
```

검증:

- target repo의 `SKILL.md` diff 확인
- 새 `references/` 또는 `scripts/` 존재 확인

## 4. artifact schema / reset source

대상:

- root `templates/version_reset/artifacts/*`
- `templates_starter/.agents/artifacts/*`
- `templates_starter/templates/version_reset/artifacts/*`

rollout:

- `sync_template_docs.ps1`

주의:

- live `.agents/artifacts/*`는 기본적으로 preserve 대상이다.

## 5. 절대 그대로 복사하지 말 것

- 운영 프로젝트의 live `.agents/artifacts/*`
- 특정 프로젝트 요구사항 문서
- project-local secret, URL, 계정 정보
- local customization이 섞인 파일
