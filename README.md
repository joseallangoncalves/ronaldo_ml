# Petrobras ML — Sistema de Predição e Análise de Aditivos Contratuais

> **Projeto de Aprendizado de Máquina**  
> **Instituição:** Universidade Federal de Goiás (UFG) — Instituto de Informática (INF)  
> **Disciplina:** Aprendizado de Máquina  
> **Docente:** Prof. Dr. Ronaldo Martins da Costa  
> **Enunciado de Referência:** `trabalho.md`  
> **Status:** 🟢 100% Concluído e Validado  

---

## 📋 Visão Geral

Este projeto desenvolve uma solução completa de Machine Learning aplicada à gestão de contratações públicas e privadas da Petrobras (amparadas pela Lei das Estatais — Lei nº 13.303/2016), com base no dataset histórico `dados/abt_modelagem_aditivos.csv` (5.787 contratos finalizados).

O sistema atende **integralmente aos 3 pilares exigidos no [trabalho.md](trabalho.md)** e respeita rigorosamente os **guardrails metodológicos** apresentados nas aulas do Prof. Dr. Ronaldo Martins da Costa.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DASHBOARD WEB REACT (Vite)                         │
│  • Simulador de Contratos em Tempo Real com Gauges e Diagnóstico            │
│  • Pilar 1: Classificação (Modelos das Aulas & Matriz de Confusão 2x2)      │
│  • Pilar 2: Regressão de Impacto Financeiro (R² = 0,7184)                   │
│  • Pilar 3: Agrupamento K-Means de Fornecedores (Silhueta = 0,6949)         │
│  • Fatores Determinantes (Permutation Importance) & Painel LGPD             │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │ HTTP / JSON
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            BACKEND FASTAPI (Python)                         │
│  • Endpoints RESTful de Inferência e Métricas Acadêmicas                   │
│  • Schemas Pydantic com Validação de Entrada e Blindagem Anti-Leakage       │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │ Carregamento .joblib
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       PIPELINE SCIKIT-LEARN & MODELOS                       │
│  • ColumnTransformer com Normalização (StandardScaler) e One-Hot Encoding   │
│  • Validação Cruzada Estratificada 5-Fold & Teste Cego (1.158 contratos)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Aderência aos 3 Pilares do `trabalho.md`

| Pilar Exigido | Algoritmo / Técnica | Variável / Objetivo | Desempenho no Teste Cego | Aula do Prof. Ronaldo |
| :--- | :--- | :--- | :---: | :--- |
| **1. Classificação (Supervisionado)** | **Random Forest Classifier** (Campeão vs KNN, Árvore Gini, Regressão Logística e Gradient Boosting) | **`fl_aditivo`** (Prever se o contrato terá aditivo: 0 ou 1) | **Recall: 80,15%**<br>F1-Score: 76,65%<br>ROC-AUC: 77,14% | **Aula 2** (Treinamento e Métricas)<br>**Aula 3** (Algoritmos) |
| **2. Previsão (Regressão)** | **Regressão Linear Múltipla com StandardScaler** (vs Ridge e Random Forest Regressor) | **`Valor_Aditivado_BRL`** (Estimar o montante em R$ dos aditivos) | **R²: 0,7184**<br>MAE: R$ 5,01M<br>RMSE: R$ 14,54M | **Aula 1c** (Regressão Linear, Gradiente Descendente e MSE) |
| **3. Agrupamento (Não Supervisionado)** | **K-Means com K-Means++ e StandardScaler** ($k=3$) | Perfis e segmentação de risco de fornecedores da Petrobras | **Silhouette: 0,6949**<br>Método do Cotovelo validado | **Aula 4.1** (Não Supervisionados, Silhueta e Cotovelo) |

---

## 🛡️ Guardrails, LGPD e Anti-Leakage

1. **Conformidade Estrita com a LGPD (Lei nº 13.709/2018):**
   - Eliminação mandatória de dados identificadores de pessoas físicas e jurídicas (`Fornecedor`, `CNPJ`, `Razao_Social_Receita`, representantes) para proteger empreendedores individuais (MEI) e prepostos.
2. **Protocolo Rígido Anti-Leakage (Momento $T_0$ da Assinatura):**
   - Uso exclusivo de dados pré-contratuais. Vedação total a variáveis pós-fato (como saldos residuais contábeis, datas de aditivos e valores aditivados durante o treinamento da classificação).
   - O ajuste (`fit`) dos transformadores e do `StandardScaler` ocorre **apenas no conjunto de treino**, aplicando unicamente `transform()` no teste.
3. **Normalização dos Atributos (`StandardScaler`):**
   - Padronização mandatória (média zero e variância unitária) em todas as variáveis numéricas para garantir convergência e justiça aos algoritmos sensíveis à escala (KNN, Regressão Logística e K-Means).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Python 3.10+** (com `pip`)
- **Node.js 18+** e **npm**

---

### Passo 1: Executar o Treinamento de Machine Learning
Para retreinar os 3 pilares e regenerar os artefatos serializados:
```bash
# Na raiz do projeto:
python src/ml/train_full_trabalho.py
```
> Os artefatos serão salvos em `backend/models/`:
> - `best_model_pipeline.joblib` (Classificador Campeão)
> - `regression_pipeline.joblib` (Regressão de Valor Aditivado)
> - `clustering_pipeline.joblib` (K-Means)
> - `metrics_report.json`, `feature_importance.json` e `contract_options.json`

---

### Passo 2: Iniciar o Backend (FastAPI)
Abra um terminal na raiz do projeto e execute:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- **API URL:** `http://127.0.0.1:8000`
- **Documentação Interativa Swagger:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/health`

---

### Passo 3: Iniciar o Frontend (React + Vite)
Abra outro terminal na pasta `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
- **Dashboard Web:** `http://127.0.0.1:5173`

---

## 🌐 Funcionalidades do Dashboard Web

O dashboard interativo conta com 7 abas funcionais:
1. **🎯 Simulador de Risco Contratual:** Permite ao gestor simular contratos antes da assinatura, testar cenários rápidos (*Contrato Crítico*, *Contrato Padronizado*, *Novo Fornecedor*), visualizar o gauge de probabilidade animado e obter diagnóstico dos fatores de risco.
2. **📊 Modelos das Aulas (Classificação):** Tabela comparativa dos 5 algoritmos ensinados pelo Prof. Ronaldo (Regressão Logística, KNN, Árvore de Decisão, Random Forest e Gradient Boosting).
3. **🔲 Matriz de Confusão 2x2:** Visualização didática dos 1.158 contratos de teste cego ($VP=545, VN=281, FP=197, FN=135$) e cards explicativos das fórmulas da Aula 2 (Acurácia, Sensibilidade/Recall, Especificidade e F1-Score).
4. **📈 Previsão Financeira (Regressão):** Painel do Pilar 2 com métricas da Regressão Linear ($R^2 = 0,7184$, MAE e RMSE).
5. **👥 Perfis de Fornecedores (Clusterização):** Painel do Pilar 3 com a segmentação em 3 clusters via K-Means e Coeficiente de Silhueta de $0,6949$.
6. **🔍 Fatores Determinantes:** Ranking de *Permutation Feature Importance* destacando o impacto do Valor Original e da Duração Contratual.
7. **🛡️ LGPD & Guardrails:** Certificação das regras de governança, minimização e blindagem temporal.

---

## 📁 Estrutura de Diretórios

```
ronaldo_ml/
├── backend/
│   ├── main.py                     # Servidor FastAPI com rotas REST e CORS
│   ├── schemas.py                  # Modelos Pydantic validados
│   ├── predictor.py                # Orquestrador de inferência dos 3 pilares
│   └── models/                     # Artefatos serializados (.joblib e .json)
├── dados/
│   ├── abt_modelagem_aditivos.csv  # Base analítica da Petrobras (5.787 contratos)
│   └── dicionario_variaveis.md     # Metadados e regras de negócio
├── documentos/                     # Slides e materiais das aulas do Prof. Ronaldo
├── frontend/
│   ├── src/
│   │   ├── components/             # Componentes React (Simulador, Gauge, Tabelas)
│   │   ├── App.jsx                 # Orquestrador do Dashboard
│   │   ├── App.css                 # Estilos visuais modernos
│   │   └── index.css               # Design system e tokens de estilo
│   └── package.json
├── specs/                          # Pacote formal de especificações técnicas
│   ├── plano_implementacao.md      # Plano versionado (v1.2.0) com histórico
│   ├── guardrails_prof_ronaldo.md  # Diretrizes acadêmicas extraídas das aulas
│   ├── conformidade_lgpd.md        # Diretrizes legais de LGPD e Anti-Leakage
│   ├── especificacao_projeto.md    # Requisitos do projeto
│   ├── especificacao_api.md        # Contratos da API
│   └── especificacao_frontend.md   # Especificação da UI
├── src/ml/
│   ├── preprocessor.py             # Pipeline com StandardScaler e OneHotEncoder
│   ├── train.py                    # Treinamento do classificador
│   └── train_full_trabalho.py      # Treinamento consolidado dos 3 pilares
├── trabalho.md                     # Enunciado oficial da disciplina
└── README.md                       # Guia geral de execução e apresentação
```

---

## 👥 Autoria e Apresentação
Desenvolvido para o **Projeto Aplicado (PA) / Disciplina de Aprendizado de Máquina**, Instituto de Informática (INF) — Universidade Federal de Goiás (UFG).
>>>>>>> ab687a2 (feat: implementacao completa dos 3 pilares de ML (Classificacao, Regressao e Clusterizacao), backend FastAPI e frontend React)
