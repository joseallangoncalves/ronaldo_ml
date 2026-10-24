# Especificação da API — Backend FastAPI (Predição de Aditivos Petrobras)

**Versão da API:** `v1.0.0`  
**Framework:** FastAPI 0.136+ (Python 3.11)  
**Validação de Esquemas:** Pydantic v2  
**Localização:** `backend/`  

---

## 1. Visão Geral da Arquitetura de Serviços

A API tem o objetivo de servir as predições do modelo de Machine Learning treinado, disponibilizar métricas acadêmicas completas para visualização no frontend e fornecer metadados para preenchimento de formulários dinâmicos.

---

## 2. Modelos Pydantic (Esquemas de Entrada e Saída)

### 2.1 Esquema de Entrada: `ContractInputSchema`
Valida todos os atributos pré-contratuais necessários para inferência:

```python
from pydantic import BaseModel, Field

class ContractInputSchema(BaseModel):
    Valor_Original: float = Field(..., gt=0, description="Valor inicial pactuado em Reais (R$)")
    duracao_planejada_dias: int = Field(..., gt=0, description="Prazo original estipulado em dias")
    tipo_fundamento_licitacao: str = Field(..., description="Licitacao_Geral_Art28, Licitacao_Por_Item, Registro_Precos ou CPSI_Inovacao")
    qtd_cont_forn_tot: int = Field(default=0, ge=0, description="Total histórico de contratos do fornecedor na Petrobras")
    qtd_cont_5a_forn: int = Field(default=0, ge=0, description="Contratos finalizados nos últimos 5 anos")
    qtd_adit_prazo_5a: int = Field(default=0, ge=0, description="Contratos com aditivo de prazo (5 anos)")
    tx_adit_prazo_5a: float = Field(default=0.0, ge=0.0, le=1.0, description="Taxa de aditivo de prazo (5 anos)")
    qtd_adit_pv_5a: int = Field(default=0, ge=0, description="Contratos com aditivo de prazo e valor (5 anos)")
    tx_adit_pv_5a: float = Field(default=0.0, ge=0.0, le=1.0, description="Taxa de aditivo de prazo e valor (5 anos)")
    qtd_adit_val_5a: int = Field(default=0, ge=0, description="Contratos com aditivo de valor (5 anos)")
    tx_adit_val_5a: float = Field(default=0.0, ge=0.0, le=1.0, description="Taxa de aditivo de valor (5 anos)")
    tx_adit_geral_5a: float = Field(default=0.0, ge=0.0, le=1.0, description="Taxa geral histórica de aditivos")
    tipo_ult_adit: str = Field(default="Nenhum", description="Prazo_e_Valor, Prazo, Valor ou Nenhum")
    Capital_Social_Receita: float = Field(default=0.0, ge=0, description="Capital social registrado na Receita Federal")
    Porte_Empresa: str = Field(default="Demais", description="Microempresa, EPP, Demais ou Não Informado")
    Natureza_Juridica: int = Field(default=2062, description="Código da natureza jurídica (ex: 2062 para Sociedade Limitada)")
```

### 2.2 Esquema de Saída: `PredictionResponseSchema`
```python
from pydantic import BaseModel
from typing import List, Dict, Any

class ContributingFactor(BaseModel):
    feature: str
    impacto_direcao: str  # "Aumenta Risco" ou "Reduz Risco"
    descricao: str

class PredictionResponseSchema(BaseModel):
    previsao_classe: int  # 0 ou 1
    rotulo: str           # "Sem Risco de Aditivo" ou "Alto Risco de Aditivo"
    probabilidade_aditivo: float       # ex: 0.785
    probabilidade_sem_aditivo: float   # ex: 0.215
    nivel_risco: str                   # "BAIXO", "MODERADO", "ALTO"
    fatores_relevantes: List[ContributingFactor]
```

---

## 3. Endpoints RESTful

### 3.1 `POST /api/predict`
- **Descrição**: Realiza a predição probabilística e classificação de risco para um novo contrato.
- **Requisição**: Corpo JSON validado por `ContractInputSchema`.
- **Resposta**: `200 OK` com `PredictionResponseSchema`.

### 3.2 `GET /api/metrics`
- **Descrição**: Retorna o relatório completo de avaliação dos modelos segundo as diretrizes da Aula 2 do Prof. Ronaldo.
- **Resposta**:
  ```json
  {
    "modelo_campeao": "Random Forest Classifier",
    "criterio_selecao": "Melhor equilíbrio de Recall e F1-Score para mitigação de FN",
    "metricas_teste": {
      "acuracia": 0.732,
      "precisao": 0.745,
      "recall_sensibilidade": 0.812,
      "especificidade": 0.618,
      "f1_score": 0.777,
      "roc_auc": 0.789
    },
    "matriz_confusao": {
      "VP": 552,
      "VN": 296,
      "FP": 182,
      "FN": 128
    },
    "comparativo_modelos": [
      {"modelo": "Regressão Logística", "acuracia": 0.698, "recall": 0.755, "f1": 0.741},
      {"modelo": "KNN (k=5)", "acuracia": 0.684, "recall": 0.710, "f1": 0.725},
      {"modelo": "Árvore de Decisão", "acuracia": 0.672, "recall": 0.702, "f1": 0.714},
      {"modelo": "Random Forest", "acuracia": 0.732, "recall": 0.812, "f1": 0.777},
      {"modelo": "Gradient Boosting", "acuracia": 0.728, "recall": 0.798, "f1": 0.771}
    ]
  }
  ```

### 3.3 `GET /api/feature-importance`
- **Descrição**: Retorna a importância relativa das features calculada via Permutation Feature Importance.

### 3.4 `GET /api/contract-options`
- **Descrição**: Fornece listas com valores únicos e exemplos pré-configurados para a interface.

### 3.5 `GET /health`
- **Descrição**: Retorna o status de integridade do serviço e versão do modelo carregado.
