# Diretrizes de Conformidade com a LGPD e Governança de Dados

**Legislação de Referência:** Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD)  
**Projeto:** Sistema de Predição de Aditivos Contratuais (Petrobras / UFG)  
**Status:** Vigente  

---

## 1. Princípios da LGPD Aplicados ao Projeto

Em estrita consonância com a Lei nº 13.709/2018 e as normas de integridade em compras públicas, o projeto adota os seguintes pilares:

| Princípio da LGPD (Art. 6º) | Implementação no Pipeline de Machine Learning |
| :--- | :--- |
| **Finalidade e Adequação** | Os dados são utilizados unicamente para fins analíticos de predição de risco e auditoria acadêmica de contratações públicas. |
| **Necessidade (Minimização)** | Utilização estrita dos atributos estatísticos e operacionais estritamente indispensáveis para prever o risco de aditivo. Descarte de quaisquer dados cadastrais supérfluos. |
| **Não Discriminação** | Vedação a qualquer inferência baseada em dados pessoais, origem ou atributos não relacionados à capacidade técnica e financeira da contratação. |
| **Segurança e Prevenção** | Descarte e mascaramento de identificadores de pessoas físicas (especialmente MEIs, cooperados e representantes legais) antes de qualquer etapa de treinamento ou exposição em API/UI. |

---

## 2. Tratamento de Dados Identificadores e Pessoais

Na base de dados `dados/abt_modelagem_aditivos.csv`, existem campos que podem conter dados de pessoas físicas (por exemplo, registros de Microempreendedores Individuais - MEI que utilizam o nome e CPF na Razão Social ou CNPJ):

| Campo Original | Risco LGPD | Tratamento Mandatório no Pipeline |
| :--- | :--- | :--- |
| **`Fornecedor`** | Pode conter nome civil de pessoa física (MEI). | **Excluído do modelo e da exibição pública.** |
| **`CNPJ` / `CNPJ_Basico`** | Identificador fiscal (em MEIs, contém parte do CPF). | **Excluído do treinamento preditivo.** No frontend, se necessário para busca, exibir mascarado: `**.***.*** / 0001-**`. |
| **`Razao_Social_Receita`** | Nome oficial empresarial que pode conter nome próprio. | **Excluído do pipeline de modelagem.** |
| **`Qualificacao_Responsavel`** | Código do responsável legal. | Descartado ou utilizado apenas como enquadramento numérico estatístico agregado, sem vínculo a qualquer CPF. |
| **`Objeto`** | Texto aberto de contratação. | Higienizado para remoção de eventuais nomes de fiscais, gestores ou prepostos citados no texto. |

---

## 3. Protocolo Anti-Leakage (Prevenção Rígida de Vazamento de Informação)

O vazamento de informação (*data leakage*) induz a previsões artificialmente perfeitas em treinamento, que falham catastroficamente em ambiente de produção e geram viés analítico.

### 3.1 Regras Temporais de Separação
O modelo atua no momento $T_0$ (data da assinatura do contrato). Nenhuma informação posterior a $T_0$ pode alimentar o modelo:

```
    Data da Assinatura (T0)               Execução / Fim do Contrato (T1)
───────────────┬────────────────────────────────────────┬───────────────────>
  AUTORIZADO:  │                     VEDADO (LEAKAGE):  │
  • Valor Original                   • Qtd_Aditivos_Total
  • Duração Planejada                • Valores Aditivados (BRL, USD)
  • Tipo de Licitação                • Saldo Bruto Residual
  • Histórico Fornecedor (5a ant.)   • Saldo Inativo Contábil
  • Porte e Capital Social           • Datas dos Aditivos
```

### 3.2 Isolamento de Pré-Processamento (ColumnTransformer no Pipeline)
- O cálculo da média, desvio padrão (`StandardScaler`), valores mínimos/máximos e categorias do `OneHotEncoder` é executado **exclusivamente sobre o conjunto de treinamento** (`X_train`).
- O conjunto de teste (`X_test`) e os novos contratos recebidos pela API sofrem estritamente `transform()`, impedindo que estatísticas de teste contaminem o treinamento.
