"""
Esquemas Pydantic para validação e serialização da API de Predição de Aditivos.
Em conformidade com LGPD e sem atributos de Data Leakage.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ContractInputSchema(BaseModel):
    Valor_Original: float = Field(
        ..., gt=0, description="Valor inicial contratado em Reais (R$)"
    )
    duracao_planejada_dias: int = Field(
        ..., gt=0, description="Duração prevista da vigência original em dias"
    )
    tipo_fundamento_licitacao: str = Field(
        default="Licitacao_Geral_Art28",
        description="Modalidade licitatória (Lei 13.303/16 ou Inovação)",
    )
    qtd_cont_forn_tot: int = Field(
        default=5, ge=0, description="Histórico total de contratos prévios do fornecedor na Petrobras"
    )
    qtd_cont_5a_forn: int = Field(
        default=3, ge=0, description="Contratos concluídos pelo fornecedor nos últimos 5 anos"
    )
    qtd_adit_prazo_5a: int = Field(
        default=1, ge=0, description="Contratos do fornecedor com aditivo de prazo nos últimos 5 anos"
    )
    tx_adit_prazo_5a: float = Field(
        default=0.33, ge=0.0, le=1.0, description="Taxa histórica de aditivos de prazo (5 anos)"
    )
    qtd_adit_pv_5a: int = Field(
        default=0, ge=0, description="Contratos com aditivo conjunto de prazo e valor (5 anos)"
    )
    tx_adit_pv_5a: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Taxa de aditivos de prazo e valor (5 anos)"
    )
    qtd_adit_val_5a: int = Field(
        default=0, ge=0, description="Contratos com aditivo de valor (5 anos)"
    )
    tx_adit_val_5a: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Taxa de aditivos de valor (5 anos)"
    )
    tx_adit_geral_5a: float = Field(
        default=0.33, ge=0.0, le=1.0, description="Taxa geral histórica de contratos com aditivos"
    )
    tipo_ult_adit: str = Field(
        default="Prazo", description="Tipo do último aditivo anterior (Prazo_e_Valor, Prazo, Valor ou Nenhum)"
    )
    Capital_Social_Receita: float = Field(
        default=1000000.0, ge=0.0, description="Capital social registrado perante a Receita Federal"
    )
    Porte_Empresa: str = Field(
        default="Demais", description="Porte empresarial oficial (Demais, EPP, Microempresa)"
    )
    Natureza_Juridica: str = Field(
        default="2062", description="Código de natureza jurídica na Receita (ex: 2062 para Sociedade Limitada)"
    )


class ContributingFactor(BaseModel):
    feature: str
    impacto_direcao: str
    descricao: str


class PredictionResponseSchema(BaseModel):
    previsao_aditivo: int
    rotulo: str
    probabilidade_aditivo: float
    probabilidade_sem_aditivo: float
    nivel_risco: str
    cor_alerta: str
    fatores_relevantes: List[ContributingFactor]
