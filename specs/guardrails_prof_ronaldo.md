# Guardrails Metodológicos e Conceituais — Prof. Dr. Ronaldo Martins da Costa (UFG)

Este documento estabelece as **diretrizes obrigatórias e fronteiras metodológicas** para o desenvolvimento de soluções de Machine Learning no projeto, extraídas rigorosamente do material didático ministrado pelo Prof. Dr. Ronaldo Martins da Costa (UFG / Instituto de Informática) presente na pasta `documentos/`.

---

## 1. Alinhamento com o Material das Aulas

O projeto deve respeitar estritamente as convenções, bibliotecas e boas práticas apresentadas nas aulas:

| Aula / Documento | Tópico Central | Guardrails Obrigatórios |
| :--- | :--- | :--- |
| **`am-aula-1a_-_Apresentacao.pdf`** | Visão Geral & Paradigmas | Clareza nos paradigmas: Supervisionado (Classificação e Regressão), Não Supervisionado e Reforço. Resolução de problemas com pipeline bem definido. |
| **`am-aula-1b_-_Revisao.pdf`** | Python Científico | Uso de `NumPy` e estruturas nativas para manipulação numérica e vetorial de alta performance. |
| **`am-aula-1c_-_Regressao.pdf`** | Regressão & Pré-processamento | Uso obrigatório de `scikit-learn` com `ColumnTransformer` e `Pipeline` para evitar vazamento de dados (*data leakage*). Otimização por Gradiente Descendente e MSE. |
| **`am-aula-2_-_Supervisionados_-_Treinamento.pdf`** | Metodologia de Treinamento & Métricas | Divisão em **Treinamento, Validação (Cross-Validation) e Teste** (70-80% treino / 10-15% validação / 10-15% teste). Otimização com `GridSearchCV`. Avaliação com **Matriz de Confusão** completa (VP, VN, FP, FN), **Acurácia**, **Precision**, **Recall** (Sensibilidade), **Especificidade** e **F1-Score** (Micro/Macro/Weighted). |
| **`am-aula-3_-_Supervisionados_-_Algoritmos.pdf`** | Algoritmos de Classificação & Avaliadores | Comparativo entre famílias de algoritmos ensinadas: **KNN**, **Árvores de Decisão (Decision Tree com Gini)**, **Random Forest**, **SVM (Support Vector Machine com kernels Linear, RBF, C e Gamma)**, **Métodos Ensemble (Bagging / Boosting)** e **LDA**. Avaliação de relevância de atributos com **Permutation Feature Importance** e importância intrínseca das árvores. |
| **`am-aula-4.1_-_Nao_Supervisionados.pdf`** | Clusterização & Redução | K-Means com K-Means++, necessidade crítica de normalização/padronização (`StandardScaler`), escolha do k ótimo via **Método do Cotovelo (WCSS/Inércia)** e **Silhouette Score**. Visualização com **PCA / LDA**. |
| **`am-aula-4.2_-_Aprendizado_por_reforco.pdf`** | Aprendizado por Reforço | Compreensão dos conceitos de Agente, Ambiente, Recompensa, Estratégia $\epsilon$-greedy e Q-Learning. |

---

## 2. Regras Rígidas de Engenharia de Dados & Prevenção de Leakage

1. **Vedação Absoluta a Variáveis Pós-Fato (Data Leakage):**
   - Para prever se um contrato sofrerá aditivo no momento de sua assinatura, **jamais** utilizar variáveis geradas durante ou após a execução contratual (ex.: `Saldo_Bruto`, `Saldo_Inativo`, `Qtd_Aditivos_Total`, valores aditivados, datas de aditivos ou vigências aditivadas).
   - Utilizar exclusivamente atributos cadastrais, histórico pretérito do fornecedor nos 5 anos anteriores (`qtd_cont_5a_forn`, `tx_adit_geral_5a`, etc.), dados de porte/capital social e características pactuadas no edital (`Valor_Original`, `duracao_planejada_dias`, `tipo_fundamento_licitacao`).

2. **Pipeline Unificado (`sklearn.pipeline.Pipeline`):**
   - Todo e qualquer pré-processamento (imputação de valores ausentes, One-Hot Encoding de variáveis categóricas, escalonamento padrão `StandardScaler` / `MinMaxScaler`) deve ser encapsulado no `Pipeline` e ajustado (`fit`) **apenas sobre o conjunto de treinamento**.
   - O conjunto de teste e os novos dados de inferência devem sofrer apenas `transform()`.

---

## 3. Critérios de Avaliação e Métricas Obrigatórias

Conforme a **Aula 2** do Prof. Ronaldo, a avaliação não pode se resumir à Acurácia simples, devendo reportar:
- **Matriz de Confusão**:
  - $VP$ (Verdadeiro Positivo): Contrato que teve aditivo previsto corretamente como aditivado.
  - $VN$ (Verdadeiro Negativo): Contrato sem aditivo previsto corretamente como sem aditivo.
  - $FP$ (Falso Positivo): Previsto com aditivo, mas não teve (custo de sobreatenção ou garantia desnecessária).
  - $FN$ (Falso Negativo): Previsto sem aditivo, mas teve aditivo (**risco crítico** de descontinuidade ou estouro orçamentário).
- **Métricas Derivadas**:
  - $\text{Acurácia} = \frac{VP + VN}{Total}$
  - $\text{Precisão (Precision)} = \frac{VP}{VP + FP}$
  - $\text{Recall (Sensibilidade)} = \frac{VP}{VP + FN}$ (Métrica prioritária pelo impacto do FN)
  - $\text{Especificidade} = \frac{VN}{VN + FP}$
  - $\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$ (com exibição por classe, Macro e Weighted)
  - **Curva ROC e ROC-AUC**

---

## 4. Algoritmos Homologados para o Projeto

Conforme a **Aula 3**:
- **Baseline / Interpretáveis**: Regressão Logística, Decision Tree (Critério Gini).
- **Ensembles & Robustos**: Random Forest Classifier, XGBoost / Gradient Boosting.
- **Baseados em Distância e Margem**: KNN Classifier (com GridSearch de $k$ e ponderação uniforme/distância) e SVM (Kernel RBF / Linear com variação de $C$ e $\gamma$).
- **Avaliadores de Importância**: Permutation Feature Importance e Feature Importances intrínseco.
