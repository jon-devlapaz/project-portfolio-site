# Portfolio evidence ledger

Reviewed: 2026-08-12 (America/Chicago)

This ledger records the material engineering claims in the portfolio. The
public version is `evidence.html`; each case study also links to its supporting
proof. The language stays within the evidence. It does not claim causality,
adoption, certification, or general performance where the proof cannot support
it.

## Selection decision

I compared the candidate repositories for employer relevance, implementation
depth, completeness, and public proof.

| Candidate | Decision | Reason |
| --- | --- | --- |
| Ask JDP | Selected | This is a public full-stack AI system. Its live behavior, security boundaries, tests, and CI are inspectable. |
| Tink | Selected | This public v1.0.0 Rust release has explicit ownership rules, an acceptance contract, CI, and release verification. |
| Tink Skills | Selected | This agent-evaluation package has four adapters, integrity checks, failure-path tests, and passed CI on published main. |
| Socratink | Not selected | The repository says it is not production. Its current evidence is a no-write model-substitution slice, not a learner outcome. |
| Legacy internal clinical tools | Not selected | The earlier portfolio described internal outcomes, but the implementation and production artifacts are not public enough to support an engineering case study. |

## Background and résumé boundary

The linked résumé draws on the same three pinned engineering sources as the
case studies. Background details are self-reported career records, not
independently audited impact evidence:

- Original public résumé artifact at portfolio commit `97089cb` (page 1):
  <https://github.com/jon-devlapaz/project-portfolio-site/blob/97089cb/assets/Jonathan_DeLaPaz_Resume.pdf>
- Line-addressable Ask JDP corpus derivative for roles, dates, team scope, and
  education at the pinned Ask JDP revision:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/src/knowledge/corpus.ts#L13-L34>
- The portfolio says only "registered nurse" and makes no current-license-status
  claim. The 45+ operation is not described as a 45+ technical or clinical team.

## Ask JDP

Pinned source revision: `3414ab07fd23e7d1dd33efdc2bdbe91de09bd007`

- Reviewed, server-only corpus boundary:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/src/knowledge/corpus.ts#L1-L9>
- Closed-corpus assistant and disclosure rules:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/src/agents/assistant.ts#L16-L31>
- CSP, no-store, same-origin, 16 KiB limit, rate limits, and readiness boundary:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/src/app.ts#L26-L105>
- Signed session and conversation ownership design:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/src/security/session.ts#L4-L103>
- Injection detection and fail-closed rate-limit ceiling:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/src/security/request-guards.ts#L3-L137>
- Backend/security tests:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/tests/backend-security.test.ts#L15-L143>
- Retention cleanup tests:
  <https://github.com/jon-devlapaz/ask-jdp/blob/3414ab07fd23e7d1dd33efdc2bdbe91de09bd007/tests/privacy-security-primitives.test.ts#L70-L235>
- Successful published CI run:
  <https://github.com/jon-devlapaz/ask-jdp/actions/runs/31541850960>
- On 2026-08-12, I checked the live root and a representative recruiter question
  in the in-app browser. This records runtime behavior at that time. It is not
  an uptime claim.

This evidence does not support claims of zero hallucinations, HIPAA or security
certification, adoption, recruiter conversion, or a general security guarantee.

## Tink

Pinned release revision: `2b082b5032b6f6cef6ea301868c499a93b86552f`

- Architecture and state-owner invariants:
  <https://github.com/jon-devlapaz/tink/blob/2b082b5032b6f6cef6ea301868c499a93b86552f/docs/ARCHITECTURE.md#L58-L107>
- Lifecycle publication semantics:
  <https://github.com/jon-devlapaz/tink/blob/2b082b5032b6f6cef6ea301868c499a93b86552f/docs/ARCHITECTURE.md#L124-L211>
- Safe tree handling and mode-aware v2 digests:
  <https://github.com/jon-devlapaz/tink/blob/2b082b5032b6f6cef6ea301868c499a93b86552f/src/skills.rs#L243-L517>
- Bounded subprocess supervision:
  <https://github.com/jon-devlapaz/tink/blob/2b082b5032b6f6cef6ea301868c499a93b86552f/src/process.rs#L100-L280>
- Acceptance traceability sensor:
  <https://github.com/jon-devlapaz/tink/blob/2b082b5032b6f6cef6ea301868c499a93b86552f/tests/acceptance_traceability.rs#L35-L94>
- Successful CI run at the release revision:
  <https://github.com/jon-devlapaz/tink/actions/runs/31654152235>
- Successful release workflow:
  <https://github.com/jon-devlapaz/tink/actions/runs/31654285766>
- Public v1.0.0 release:
  <https://github.com/jon-devlapaz/tink/releases/tag/v1.0.0>

This evidence does not support claims of adoption, uptime, a reliability
percentage, cross-owner transactions, concurrent mutation safety, Windows
support, private GitHub support, or a general performance SLA.

## Tink Skills evaluation loop

Pinned published-main revision: `0ed494674634a0931f63c04437126fd0a2390f2a`

- Paired evaluation contract, exact model identity, and budget gate:
  <https://github.com/jon-devlapaz/tink-skills/blob/0ed494674634a0931f63c04437126fd0a2390f2a/skills/skill-eval-loop/SKILL.md#L1-L42>
- Reference/counter-reference validation:
  <https://github.com/jon-devlapaz/tink-skills/blob/0ed494674634a0931f63c04437126fd0a2390f2a/skills/skill-eval-loop/scripts/run_skill_eval.py#L152-L214>
- Condition artifacts and hashes:
  <https://github.com/jon-devlapaz/tink-skills/blob/0ed494674634a0931f63c04437126fd0a2390f2a/skills/skill-eval-loop/scripts/run_skill_eval.py#L360-L447>
- Four harness adapters and payload isolation:
  <https://github.com/jon-devlapaz/tink-skills/blob/0ed494674634a0931f63c04437126fd0a2390f2a/skills/skill-eval-loop/scripts/runtime_adapters.py#L21-L176>
- Reaggregation path and hash validation:
  <https://github.com/jon-devlapaz/tink-skills/blob/0ed494674634a0931f63c04437126fd0a2390f2a/skills/skill-eval-loop/scripts/aggregate_benchmark.py#L62-L144>
- Interpretation and claim limits:
  <https://github.com/jon-devlapaz/tink-skills/blob/0ed494674634a0931f63c04437126fd0a2390f2a/skills/skill-eval-loop/references/interpret-benchmark.md#L35-L45>
- Successful published-main validation run:
  <https://github.com/jon-devlapaz/tink-skills/actions/runs/31457035439>

During inspection, the local repository was two commits ahead of published
`origin/main`. Portfolio claims therefore point to the public revision above,
not the unpublished working tree.

This evidence does not show that any skill improves outcomes or proves
causality or statistical significance. It also does not show blind
independence, uniform enforcement across harnesses, a provider cost when the
harness does not report one, adoption, or universal efficacy.

## Socratink non-selection evidence

- Repository status explicitly says it is not production:
  <https://github.com/jon-devlapaz/socraTink/blob/61fe4623a99a20d69c6008aff46f6eada34acfb7/README.md#L82-L88>
- The canonical harness returns no learner-state effects:
  <https://github.com/jon-devlapaz/socraTink/blob/61fe4623a99a20d69c6008aff46f6eada34acfb7/src/agent-harness/index.ts#L91-L138>
- Its focused test proves only presentation substitution without canonical-state change:
  <https://github.com/jon-devlapaz/socraTink/blob/61fe4623a99a20d69c6008aff46f6eada34acfb7/tests/agent-harness/model-substitution.test.ts#L99-L121>

This portfolio does not claim that Socratink is a production learner platform,
has active users, or improves learning outcomes.
