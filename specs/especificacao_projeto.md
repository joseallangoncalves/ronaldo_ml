# Especificação Técnica do Projeto — Predição de Aditivos Contratuais (Petrobras)

Este documento especifica os requisitos funcionais, arquiteturais, matemáticos e de software para o sistema de predição de aditivos em contratos da Petrobras, em total consonância com as aulas do Prof. Dr. Ronaldo Martins da Costa.

---

## 1. Visão Geral do Sistema

### 1.1 Objetivo de Negócio
No contexto de contratações públicas e privadas de grande porte (Lei 13.303/16 - Lei das Estatais), aditivos de prazo e valor geram imprevisibilidade orçamentária, retrabalho administrativo e riscos de governança. O objetivo deste sistema é **prever, no momento da assinatura do contrato, a probabilidade de ocorrência de aditivo (`fl_aditivo` = 1)**, permitindo à Petrobras adotar medidas preventivas de gestão e mitigação de riscos.

### 1.2 Arquitetura Geral
O sistema adota uma arquitetura em camadas desacopladas:
```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React)                     │
│  - Simulador Interativo de Contratos                   │
│  - Indicador Visual de Probabilidade e Risco           │
│  - Dashboard de Métricas da Aula (Matriz de Confusão) │
│  - Análise de Importância das Features                 │
└───────────────────────────▲────────────────────────────┘
                            │ HTTP / JSON (REST)
┌───────────────────────────▼────────────────────────────┐
│                  Backend (FastAPI)                     │
│  - Validação de Esquema com Pydantic                   │
│  - Pipeline de Inferência Sklearn (fit prévio)         │
│  - Exposição de Métricas, Benchmarks e Endpoints       │
└───────────────────────────▲────────────────────────────┘
                            │ Carregamento de Artefatos (.joblib)
┌───────────────────────────▼────────────────────────────┐
│             Pipeline de Machine Learning               │
│  - Pré-processamento com ColumnTransformer             │
│  - Validação Cruzada Estratificada (K-Fold)            │
│  - Otimização com GridSearchCV                         │
│  - Algoritmos das Aulas (KNN, RF, DT, SVM, Boosting)   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Engenharia de Dados e Variáveis Selecionadas

Base de dados: `dados/abt_modelagem_aditivos.csv` (5.787 contratos finalizados).

### 2.1 Variável Alvo (Target)
- **`fl_aditivo`**:
  - `1`: Contrato que sofreu ao menos um termo aditivo (58,7% da base).
  - `0`: Contrato executado sem aditivos (41,3% da base).

### 2.2 Variáveis Preditoras Autorizadas (Pré-Contratuais)
Para garantir ausência de *data leakage*, utilizam-se apenas dados disponíveis até a assinatura do contrato:

| Variável | Tipo | Descrição | Tratamento / Pipeline |
| :--- | :---: | :--- | :--- |
| `Valor_Original` | Numérica (Contínua) | Valor inicial contratado em R$ | Imputer (Mediana) + StandardScaler / Log |
| `duracao_planejada_dias` | Numérica (Discreta) | Duração inicial estipulada em dias | Imputer (Mediana) + StandardScaler |
| `tipo_fundamento_licitacao` | Categórica | Categoria legal da licitação | One-Hot Encoding (Drop First / OHE) |
| `qtd_cont_forn_tot` | Numérica | Histórico total de contratos do fornecedor | StandardScaler |
| `qtd_cont_5a_forn` | Numérica | Volume de contratos entregues nos últimos 5 anos | StandardScaler |
| `qtd_adit_prazo_5a` | Numérica | Aditivos de prazo do fornecedor (5 anos) | StandardScaler |
| `tx_adit_prazo_5a` | Numérica (Taxa) | Proporção de aditivos de prazo anteriores | StandardScaler |
| `qtd_adit_pv_5a` | Numérica | Aditivos de prazo e valor anteriores | StandardScaler |
| `tx_adit_pv_5a` | Numérica (Taxa) | Proporção de aditivos de prazo + valor | StandardScaler |
| `qtd_adit_val_5a` | Numérica | Aditivos de valor anteriores | StandardScaler |
| `tx_adit_val_5a` | Numérica (Taxa) | Proporção de aditivos de valor anteriores | StandardScaler |
| `tx_adit_geral_5a` | Numérica (Taxa) | Taxa geral histórica de aditivos | StandardScaler |
| `tipo_ult_adit` | Categórica | Tipo do último aditivo anterior do fornecedor | One-Hot Encoding |
| `Capital_Social_Receita` | Numérica | Capital social oficial da contratada (RFB) | Imputer + Log/StandardScaler |
| `Porte_Empresa` | Categórica | Porte cadastrado na Receita (ME, EPP, Demais) | One-Hot Encoding |
| `Natureza_Juridica` | Categórica | Código de enquadramento societário | One-Hot Encoding (Top K / Agrupado) |

### 2.3 Variáveis Vedadas (Exclusão por Vazamento de Dados / Identificadores)
- **Pós-Fato**: `Saldo_Bruto`, `Saldo_Inativo`, todas as colunas `Qtd_Aditivos_*`, `Valor_Aditivado_*`, `Data_Primeiro_Aditivo`, `Data_Ultimo_Aditivo`, `*Com_Aditivo`, `Fim_Efetivo_DT`.
- **Identificadores/Metadados Neutros**: `Numero_Contrato`, `CNPJ`, `CNPJ_Basico`, `Fornecedor`, `Razao_Social_Receita`, `Situacao` (todos concluídos), `Fundamento_Legal` (coberto pelo tipo).

---

## 3. Metodologia de Modelagem e Treinamento

### 3.1 Divisão dos Dados (Split)
- **Conjunto de Treinamento**: 80% (4.629 contratos) com divisão estratificada por `fl_aditivo`.
- **Conjunto de Teste Cego Final**: 20% (1.158 contratos) reservado estritamente para avaliação final.
- **Validação Interna**: 5-Fold Stratified Cross-Validation aplicado sobre o conjunto de treino via `GridSearchCV`.

### 3.2 Algoritmos a Comparar (conforme Aulas 2 e 3 do Prof. Ronaldo)
1. **Regressão Logística (`LogisticRegression`)**: Benchmark linear probabilístico com regularização L2.
2. **K-Nearest Neighbors (`KNeighborsClassifier`)**: Teste de $k \in [3, 5, 7, 11]$ com pesos uniformes e por distância euclidiana padronizada.
3. **Árvore de Decisão (`DecisionTreeClassifier`)**: Critério Gini, controle de `max_depth` e `min_samples_split`.
4. **Random Forest (`RandomForestClassifier`)**: Ensemble de árvores bagging com `n_estimators`, profundidade e amostragem de atributos.
5. **Support Vector Machine (`SVC`)**: Kernel RBF e Linear com afinação de $C$ e $\gamma$.
6. **Gradient Boosting / XGBoost (`GradientBoostingClassifier`)**: Método ensemble boosting de alta precisão.

### 3.3 Relatório de Métricas Mandatórias
O sistema computará e exibirá:
- **Matriz de Confusão** completa com valores absolutos e percentuais.
- **Acurácia**, **Precision**, **Recall (Sensibilidade)**, **Especificidade** e **F1-Score** (Macro, Weighted e por classe).
- **Curva ROC e Área sob a Curva (ROC-AUC)**.
- **Permutation Feature Importance** para interpretabilidade dos fatores de risco.

---

## 4. Especificação da API (FastAPI)

- **`POST /api/predict`**:
  - Entrada: JSON com os atributos do contrato (valores contratuais, duração, dados do fornecedor).
  - Saída:
    ```json
    {
      "previsao_aditivo": 1,
      "rotulo": "Risco de Aditivo",
      "probabilidade_aditivo": 0.742,
      "probabilidade_sem_aditivo": 0.258,
      "nivel_risco": "ALTO",
      "fatores_contribuintes": [
        {"feature": "tx_adit_geral_5a", "impacto": "+0.28"},
        {"feature": "duracao_planejada_dias", "impacto": "+0.15"}
      ]
    }
    ```
- **`GET /api/metrics`**:
  - Retorna o comparativo completo de todos os modelos testados, hiperparâmetros ótimos e a matriz de confusão do modelo campeão.
- **`GET /api/feature-importance`**:
  - Retorna o ranking das variáveis mais decisivas segundo a Permutation Feature Importance.
- **`GET /api/metadata`**:
  - Retorna opções para os campos categóricos (`Porte_Empresa`, `tipo_fundamento_licitacao`, etc.) e intervalos válidos para validação no frontend.

---

## 5. Especificação do Frontend (React)

- **Simulador de Contrato**: Formulário com sliders, seletores e validações em tempo real para permitir testar qualquer perfil de contratação.
- **Card de Decisão e Risco**:
  - Gauge visual (0 a 100%) da probabilidade de aditivo.
  - Classificação de Risco por cores: Verde (Baixo, < 40%), Amarelo (Moderado, 40-60%), Vermelho (Alto, > 60%).
- **Painel Acadêmico UFG / Prof. Ronaldo**:
  - Tabela comparativa dos modelos (KNN vs Árvore vs Random Forest vs SVM vs Gradient Boosting).
  - Visualização interativa da Matriz de Confusão ($VP$, $VN$, $FP$, $FN$).
  - Gráfico de importância das variáveis.
- **Design System**: Interface com visual moderno, tipografia limpa, suporte a temas e layout responsivo.
