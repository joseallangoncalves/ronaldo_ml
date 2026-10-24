# Pacote de Especificações Técnicas — Projeto ML Petrobras (UFG)

Este diretório reúne todas as especificações técnicas, metodológicas e operacionais do projeto de Machine Learning para a predição de aditivos em contratos da Petrobras.

---

## 📂 Índice do Pacote de Especificações

| Documento | Versão | Descrição |
| :--- | :---: | :--- |
| **[plano_implementacao.md](file:///c:/Users/User/Documents/GitHub/ronaldo_ml/specs/plano_implementacao.md)** | `v1.0.1` | **Plano de Implementação Versionado**: Changelog, quadro de evolução das fases, checklist de tarefas e critérios de transição. |
| **[conformidade_lgpd_e_governanca.md](file:///c:/Users/User/Documents/GitHub/ronaldo_ml/specs/conformidade_lgpd_e_governanca.md)** | `v1.0.0` | **Diretrizes de LGPD e Anti-Leakage**: Anonimização de MEIs e representantes, minimização de dados e blindagem temporal na assinatura ($T_0$). |
| **[guardrails_prof_ronaldo.md](file:///c:/Users/User/Documents/GitHub/ronaldo_ml/specs/guardrails_prof_ronaldo.md)** | `v1.0.0` | **Guardrails Acadêmicos**: Restrições metodológicas obrigatórias extraídas das Aulas 1 a 4 do Prof. Dr. Ronaldo Martins da Costa (UFG). |
| **[especificacao_projeto.md](file:///c:/Users/User/Documents/GitHub/ronaldo_ml/specs/especificacao_projeto.md)** | `v1.0.0` | **Especificação Geral do Projeto**: Definição da base Petrobras, prevenção estrita de *data leakage*, divisão estratificada (80/20) e métricas. |
| **[especificacao_api.md](file:///c:/Users/User/Documents/GitHub/ronaldo_ml/specs/especificacao_api.md)** | `v1.0.0` | **Especificação da API (FastAPI)**: Modelos de dados Pydantic, endpoints RESTful (`/api/predict`, `/api/metrics`, etc.) e contratos de payload. |
| **[especificacao_frontend.md](file:///c:/Users/User/Documents/GitHub/ronaldo_ml/specs/especificacao_frontend.md)** | `v1.0.0` | **Especificação do Frontend (React)**: Arquitetura de componentes, simulador interativo, design tokens e painel acadêmico das métricas da aula. |

---

## 🚀 Como este pacote evolui

Cada fase do plano de implementação possui versionamento formal:
- **`v1.0.0`**: Especificações aprovadas e baseline do projeto.
- **`v1.0.1`**: Inclusão de governança LGPD, normalização dos dados e blindagem anti-leakage.
- **`v1.1.0`**: Conclusão do treinamento dos modelos e persistência dos artefatos.
- **`v1.2.0`**: Disponibilização da API FastAPI.
- **`v1.3.0`**: Disponibilização da UI React e integração ponta a ponta.
