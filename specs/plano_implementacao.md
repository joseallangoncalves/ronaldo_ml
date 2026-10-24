# Plano de Implementação Versionado — Sistema ML de Aditivos Contratuais (Petrobras)

**Versão Atual:** `v1.2.0`  
**Última Atualização:** 2026-10-24  
**Disciplina:** Aprendizado de Máquina — Prof. Dr. Ronaldo Martins da Costa (UFG / Instituto de Informática)  
**Status Geral:** 🟢 100% Concluído — Todas as Fases Entregues e Validadas  

---

## 📌 Histórico de Versões (Changelog)

| Versão | Data | Autor | Descrição das Alterações | Status da Versão |
| :---: | :---: | :---: | :--- | :---: |
| **`v1.0.0`** | 2026-10-24 | Equipe / Antigravity | • Estruturação inicial do plano em 5 fases e mapeamento dos guardrails. | Superada |
| **`v1.0.1`** | 2026-10-24 | Equipe / Antigravity | • Conformidade com LGPD (Lei 13.709/18), normalização `StandardScaler` e protocolo anti-leakage ($T_0$). | Superada |
| **`v1.1.0`** | 2026-10-24 | Equipe / Antigravity | • Treinamento supervisionado da Classificação (`fl_aditivo`), validação cruzada 5-Fold e homologação do Random Forest Campeão. | Superada |
| **`v1.2.0`** | 2026-10-24 | Equipe / Antigravity | • **Aderência Integral aos 3 Pilares do `trabalho.md`:**<br>  1. **Classificação:** Random Forest (Recall 80,15%, F1 76,65%).<br>  2. **Regressão:** Estimativa de `Valor_Aditivado_BRL` (Regressão Linear Múltipla, $R^2 = 0,7184$, Aula 1c).<br>  3. **Clusterização:** Segmentação K-Means com K=3 (Silhouette Score 0,6949, Aula 4.1).<br>• Backend FastAPI ativo com endpoints para os 3 pilares.<br>• Frontend React interativo com 7 abas e simulação em tempo real.<br>• Criação do `README.md` consolidado para apresentação e execução. | **Aprovado / Vigente** |

---

## 📊 Quadro de Evolução e Progresso das Tarefas

| Fase | Descrição | Status | Progresso | Entregáveis Principais |
| :---: | :--- | :---: | :---: | :--- |
| **Fase 1** | Pipeline de Dados, Normalização & Treinamento | 🟢 **Concluído** | 100% | `src/ml/preprocessor.py`, `src/ml/train.py`, normalização `StandardScaler`, split 80/20, 5-Fold CV, blindagem LGPD |
| **Fase 2** | Avaliação Acadêmica & Serialização | 🟢 **Concluído** | 100% | Matriz de confusão, métricas detalhadas, `best_model_pipeline.joblib`, `regression_pipeline.joblib`, `clustering_pipeline.joblib` |
| **Fase 3** | Backend em Python (FastAPI) | 🟢 **Concluído** | 100% | `backend/main.py`, `backend/schemas.py`, `/api/predict`, `/api/predict-value`, `/api/predict-cluster`, `/api/metrics` |
| **Fase 4** | Frontend em React (Vite) | 🟢 **Concluído** | 100% | Simulador interativo, gauge de risco, matriz 2x2, painéis dos 3 pilares (Classificação, Regressão, Clusterização) |
| **Fase 5** | Validação Integrada & Homologação | 🟢 **Concluído** | 100% | Testes end-to-end validados no browser, `README.md` criado na raiz |

---

## 🎯 Síntese dos 3 Pilares Entregues (100% Aderente ao `trabalho.md`)

1. **Previsão (Regressão Supervisionada):**
   - **Variável:** `Valor_Aditivado_BRL`.
   - **Modelo:** Regressão Linear Múltipla com `StandardScaler` (Aulas 1c e 2).
   - **Resultado:** $R^2 = 0,7184$ | $\text{MAE} = \text{R\$}~5.017.167,13$ | $\text{RMSE} = \text{R\$}~14.544.423,67$.
2. **Classificação (Aprendizado Supervisionado):**
   - **Variável:** `fl_aditivo` (0 ou 1).
   - **Modelo Campeão:** Random Forest Classifier (Aulas 2 e 3).
   - **Resultado:** Sensibilidade (Recall) de **$80,15\%$**, F1-Score de **$76,65\%$**, ROC-AUC de **$0,7714$** e Acurácia de **$71,33\%$** no teste cego.
3. **Agrupamento/Clusterização (Aprendizado não Supervisionado):**
   - **Algoritmo:** K-Means ($k=3$) com inicialização K-Means++ e dados padronizados (Aula 4.1).
   - **Resultado:** Coeficiente de Silhueta de **$0,6949$** e validação da Inércia pelo Método do Cotovelo.
   - **Perfis Identificados:** Operação Padrão ($74,7\%$), Fornecedores Críticos ($5,1\%$) e Serviços Contínuos ($20,1\%$).
