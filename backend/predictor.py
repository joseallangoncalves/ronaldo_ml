"""
Orquestrador de Inferência de Machine Learning.
Carrega o pipeline serializado (.joblib) e produz predições probabilísticas e explicações de risco.
"""

import os
import json
import joblib
import pandas as pd
from typing import Dict, Any, List

from schemas import ContractInputSchema, PredictionResponseSchema, ContributingFactor


class ContractPredictor:
    def __init__(self, models_dir: str = "backend/models"):
        self.models_dir = models_dir
        self.model_pipeline = None
        self.regression_pipeline = None
        self.clustering_data = None
        self.metrics_report = {}
        self.feature_importance = []
        self.contract_options = {}
        self.trabalho_report = {}
        self.load_artifacts()

    def load_artifacts(self):
        pipeline_path = os.path.join(self.models_dir, "best_model_pipeline.joblib")
        if os.path.exists(pipeline_path):
            self.model_pipeline = joblib.load(pipeline_path)
            print(f"[OK] Pipeline ML Classificação carregado de: {pipeline_path}")
            
        reg_path = os.path.join(self.models_dir, "regression_pipeline.joblib")
        if os.path.exists(reg_path):
            self.regression_pipeline = joblib.load(reg_path)
            print(f"[OK] Pipeline ML Regressão carregado de: {reg_path}")

        clust_path = os.path.join(self.models_dir, "clustering_pipeline.joblib")
        if os.path.exists(clust_path):
            self.clustering_data = joblib.load(clust_path)
            print(f"[OK] Pipeline ML Clusterização carregado de: {clust_path}")

        trabalho_path = os.path.join(self.models_dir, "trabalho_completo_report.json")
        if os.path.exists(trabalho_path):
            with open(trabalho_path, "r", encoding="utf-8") as f:
                self.trabalho_report = json.load(f)

        metrics_path = os.path.join(self.models_dir, "metrics_report.json")
        if os.path.exists(metrics_path):
            with open(metrics_path, "r", encoding="utf-8") as f:
                self.metrics_report = json.load(f)

        fi_path = os.path.join(self.models_dir, "feature_importance.json")
        if os.path.exists(fi_path):
            with open(fi_path, "r", encoding="utf-8") as f:
                self.feature_importance = json.load(f)

        opts_path = os.path.join(self.models_dir, "contract_options.json")
        if os.path.exists(opts_path):
            with open(opts_path, "r", encoding="utf-8") as f:
                self.contract_options = json.load(f)

    def predict(self, contract: ContractInputSchema) -> PredictionResponseSchema:
        if self.model_pipeline is None:
            raise RuntimeError("Modelo de Machine Learning não carregado.")

        # Converter schema em DataFrame para o pipeline
        data_dict = contract.model_dump()
        df_input = pd.DataFrame([data_dict])

        # Inferência com pipeline (ColumnTransformer + Random Forest)
        proba = self.model_pipeline.predict_proba(df_input)[0]
        prob_aditivo = float(proba[1])
        prob_sem_aditivo = float(proba[0])
        pred_classe = int(prob_aditivo >= 0.50)

        # Categorização de Risco
        if prob_aditivo >= 0.65:
            nivel_risco = "ALTO"
            cor_alerta = "#ef4444"
            rotulo = "Alto Risco de Aditivo"
        elif prob_aditivo >= 0.45:
            nivel_risco = "MODERADO"
            cor_alerta = "#f59e0b"
            rotulo = "Risco Moderado de Aditivo"
        else:
            nivel_risco = "BAIXO"
            cor_alerta = "#10b981"
            rotulo = "Baixo Risco de Aditivo"

        # Identificação explicativa dos fatores contribuintes
        fatores: List[ContributingFactor] = []

        if contract.tx_adit_geral_5a >= 0.50:
            fatores.append(
                ContributingFactor(
                    feature="Taxa Histórica de Aditivos",
                    impacto_direcao="Aumenta Risco",
                    descricao=f"Fornecedor possui {contract.tx_adit_geral_5a:.1%} dos contratos anteriores aditivados.",
                )
            )
        elif contract.qtd_cont_5a_forn > 0 and contract.tx_adit_geral_5a < 0.20:
            fatores.append(
                ContributingFactor(
                    feature="Histórico Favorável",
                    impacto_direcao="Reduz Risco",
                    descricao="Fornecedor entregou a grande maioria dos contratos anteriores sem aditivos.",
                )
            )

        if contract.duracao_planejada_dias >= 365:
            fatores.append(
                ContributingFactor(
                    feature="Duração Contratual Longa",
                    impacto_direcao="Aumenta Risco",
                    descricao=f"Prazo de {contract.duracao_planejada_dias} dias eleva a probabilidade de prorrogações temporais.",
                )
            )
        elif contract.duracao_planejada_dias <= 120:
            fatores.append(
                ContributingFactor(
                    feature="Prazo Reduzido",
                    impacto_direcao="Reduz Risco",
                    descricao="Contratos de ciclo curto sofrem menor índice de aditivos.",
                )
            )

        if contract.Valor_Original >= 5000000:
            fatores.append(
                ContributingFactor(
                    feature="Vulto Financeiro Elevado",
                    impacto_direcao="Aumenta Risco",
                    descricao="Contratos de alto valor têm maior propensão estatística a repactuações de escopo.",
                )
            )

        if contract.tipo_ult_adit in ["Prazo_e_Valor", "Prazo", "Valor"]:
            fatores.append(
                ContributingFactor(
                    feature="Último Contrato Aditivado",
                    impacto_direcao="Aumenta Risco",
                    descricao=f"O fornecedor demandou aditivo de {contract.tipo_ult_adit.replace('_', ' ')} na entrega anterior.",
                )
            )

        if contract.qtd_cont_5a_forn == 0:
            fatores.append(
                ContributingFactor(
                    feature="Novo Fornecedor",
                    impacto_direcao="Incerteza",
                    descricao="Empresa sem histórico na Petrobras nos últimos 5 anos; perfil moderado por ausência de dados pretéritos.",
                )
            )

        return PredictionResponseSchema(
            previsao_aditivo=pred_classe,
            rotulo=rotulo,
            probabilidade_aditivo=round(prob_aditivo, 4),
            probabilidade_sem_aditivo=round(prob_sem_aditivo, 4),
            nivel_risco=nivel_risco,
            cor_alerta=cor_alerta,
            fatores_relevantes=fatores,
        )

    def predict_value(self, contract: ContractInputSchema) -> Dict[str, Any]:
        """Previsão por Regressão (Pilar 2) do valor financeiro estimado do aditivo."""
        if self.regression_pipeline is None:
            raise RuntimeError("Pipeline de regressão não carregado.")
        
        feats = ["Valor_Original", "duracao_planejada_dias", "tx_adit_geral_5a", "Capital_Social_Receita", "qtd_cont_5a_forn"]
        data = {k: getattr(contract, k, 0) for k in feats}
        df_in = pd.DataFrame([data])
        val_pred = float(self.regression_pipeline.predict(df_in)[0])
        val_pred = max(0.0, val_pred)
        
        return {
            "valor_aditivado_estimado_brl": round(val_pred, 2),
            "percentual_sobre_original": round((val_pred / max(1.0, contract.Valor_Original)) * 100, 2),
            "modelo_utilizado": "Regressão Linear Múltipla com StandardScaler (Aula 1c)",
        }

    def get_cluster(self, contract: ContractInputSchema) -> Dict[str, Any]:
        """Atribuição do perfil de Cluster (Pilar 3) K-Means."""
        if self.clustering_data is None:
            raise RuntimeError("Pipeline de clusterização não carregado.")
        
        feats = self.clustering_data["features"]
        data = {k: getattr(contract, k, 0) for k in feats}
        df_in = pd.DataFrame([data])
        scaler = self.clustering_data["scaler"]
        kmeans = self.clustering_data["kmeans"]
        scaled = scaler.transform(df_in)
        c_id = int(kmeans.predict(scaled)[0])
        
        profiles = self.trabalho_report.get("clusterizacao", {}).get("perfis_clusters", [])
        matched = next((p for p in profiles if p["cluster_id"] == c_id), None)
        return {
            "cluster_id": c_id,
            "perfil": matched,
        }


predictor = ContractPredictor()
