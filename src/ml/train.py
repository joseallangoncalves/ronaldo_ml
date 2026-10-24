"""
Script de Treinamento, Validação Cruzada, Avaliação Acadêmica e Persistência.
Implementa os algoritmos e métricas das Aulas 2 e 3 do Prof. Dr. Ronaldo Martins da Costa.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any

from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.inspection import permutation_importance

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from preprocessor import (
    get_train_test_data,
    build_preprocessor,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
)


def get_models_dict() -> Dict[str, Any]:
    """
    Retorna os modelos selecionados conforme as Aulas 2 e 3.
    """
    return {
        "Regressão Logística": LogisticRegression(max_iter=1000, random_state=42),
        "KNN (k=5)": KNeighborsClassifier(n_neighbors=5, weights="distance"),
        "Árvore de Decisão (Gini)": DecisionTreeClassifier(criterion="gini", max_depth=6, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42),
    }


def compute_metrics(y_true, y_pred, y_proba) -> Dict[str, Any]:
    """
    Calcula detalhadamente as métricas exigidas pela Aula 2.
    """
    cm = confusion_matrix(y_true, y_pred)
    # Matriz 2x2: [[VN, FP], [FN, VP]]
    vn, fp, fn, vp = cm.ravel()
    
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    spec = vn / (vn + fp) if (vn + fp) > 0 else 0.0
    f1 = f1_score(y_true, y_pred, zero_division=0)
    f1_macro = f1_score(y_true, y_pred, average="macro", zero_division=0)
    f1_weighted = f1_score(y_true, y_pred, average="weighted", zero_division=0)
    auc = roc_auc_score(y_true, y_proba) if y_proba is not None else 0.0
    
    return {
        "matriz_confusao": {
            "VP": int(vp),
            "VN": int(vn),
            "FP": int(fp),
            "FN": int(fn),
        },
        "acuracia": round(float(acc), 4),
        "precisao": round(float(prec), 4),
        "recall_sensibilidade": round(float(rec), 4),
        "especificidade": round(float(spec), 4),
        "f1_score": round(float(f1), 4),
        "f1_macro": round(float(f1_macro), 4),
        "f1_weighted": round(float(f1_weighted), 4),
        "roc_auc": round(float(auc), 4),
    }


def main():
    print("=" * 70)
    print(">> INICIANDO TREINAMENTO E VALIDACAO - PROJETO ML PETROBRAS (UFG)")
    print("=" * 70)
    
    os.makedirs("backend/models", exist_ok=True)
    
    # 1. Carregamento dos dados divididos (80% treino / 20% teste)
    print("\n[1/5] Carregando e separando base de dados...")
    X_train, X_test, y_train, y_test = get_train_test_data()
    print(f"  * Amostras de Treinamento (80%): {len(X_train)} contratos")
    print(f"  * Amostras de Teste Cego (20%):   {len(X_test)} contratos")
    print(f"  * Proporcao da classe positiva (fl_aditivo=1) no treino: {y_train.mean():.2%}")
    
    # 2. Inicialização dos modelos
    models = get_models_dict()
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    benchmark_results = []
    trained_pipelines = {}
    
    print("\n[2/5] Executando Validacao Cruzada (5-Fold CV) e Treinamento nos Modelos...")
    
    for name, clf in models.items():
        # Pipeline unificado garantindo que a normalização aconteça estritamente no treino
        preprocessor = build_preprocessor()
        pipe = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", clf),
        ])
        
        # Validação Cruzada 5-Fold
        cv_scores = cross_val_score(pipe, X_train, y_train, cv=cv, scoring="f1")
        
        # Ajuste completo no conjunto de treinamento
        pipe.fit(X_train, y_train)
        trained_pipelines[name] = pipe
        
        # Avaliação no conjunto de teste cego
        y_pred = pipe.predict(X_test)
        y_proba = pipe.predict_proba(X_test)[:, 1] if hasattr(clf, "predict_proba") else None
        
        metrics = compute_metrics(y_test, y_pred, y_proba)
        
        result_entry = {
            "modelo": name,
            "cv_f1_mean": round(float(cv_scores.mean()), 4),
            "cv_f1_std": round(float(cv_scores.std()), 4),
            **metrics,
        }
        benchmark_results.append(result_entry)
        
        print(f"  [OK] {name:25s} | CV F1: {cv_scores.mean():.4f} | Test Acc: {metrics['acuracia']:.4f} | Recall: {metrics['recall_sensibilidade']:.4f} | F1: {metrics['f1_score']:.4f} | AUC: {metrics['roc_auc']:.4f}")

    # 3. Escolha do Modelo Campeão
    # Critério: Melhor equilíbrio de Recall e F1-Score para mitigar Falsos Negativos
    champion_entry = max(benchmark_results, key=lambda x: (x["f1_score"] * 0.6 + x["recall_sensibilidade"] * 0.4))
    champion_name = champion_entry["modelo"]
    champion_pipe = trained_pipelines[champion_name]
    
    print(f"\n[3/5] Modelo Campeao Selecionado: {champion_name}")
    print(f"      Critério: F1-Score ({champion_entry['f1_score']}) e Recall ({champion_entry['recall_sensibilidade']})")
    
    # 4. Cálculo de Permutation Feature Importance (Aula 3)
    print("\n[4/5] Computando Permutation Feature Importance...")
    perm_importance = permutation_importance(
        champion_pipe, X_test, y_test, n_repeats=10, random_state=42, n_jobs=-1
    )
    
    feature_names = list(X_test.columns)
    importance_list = []
    for idx, col in enumerate(feature_names):
        importance_list.append({
            "feature": col,
            "importance_mean": round(float(perm_importance.importances_mean[idx]), 5),
            "importance_std": round(float(perm_importance.importances_std[idx]), 5),
        })
    importance_list.sort(key=lambda x: x["importance_mean"], reverse=True)
    
    print("      Top 5 Variáveis Mais Determinantes:")
    for item in importance_list[:5]:
        print(f"       - {item['feature']:28s}: impacto médio = {item['importance_mean']:.5f}")

    # 5. Serialização dos Artefatos
    print("\n[5/5] Serializando Artefatos para o Backend...")
    
    # Modelo campeão
    model_path = "backend/models/best_model_pipeline.joblib"
    joblib.dump(champion_pipe, model_path)
    print(f"  • Pipeline completo salvo em: {model_path}")
    
    # Relatório de Métricas e Benchmarks
    metrics_report = {
        "modelo_campeao": champion_name,
        "justificativa_escolha": "Modelo com maior equilíbrio de Sensibilidade (Recall) e F1-Score no teste cego, mitigando perdas por Falsos Negativos.",
        "metricas_campeao": champion_entry,
        "comparativo_modelos": benchmark_results,
    }
    with open("backend/models/metrics_report.json", "w", encoding="utf-8") as f:
        json.dump(metrics_report, f, indent=2, ensure_ascii=False)
    print("  • Relatório de Métricas salvo em: backend/models/metrics_report.json")
    
    # Importância das Features
    with open("backend/models/feature_importance.json", "w", encoding="utf-8") as f:
        json.dump(importance_list, f, indent=2, ensure_ascii=False)
    print("  • Importância de Features salva em: backend/models/feature_importance.json")
    
    # Metadados e Opções para a UI
    options_meta = {
        "tipo_fundamento_licitacao": sorted(X_train["tipo_fundamento_licitacao"].unique().tolist()),
        "tipo_ult_adit": sorted(X_train["tipo_ult_adit"].unique().tolist()),
        "Porte_Empresa": sorted(X_train["Porte_Empresa"].unique().tolist()),
        "estatisticas_numericas": {
            col: {
                "min": round(float(X_train[col].min()), 2),
                "mediana": round(float(X_train[col].median()), 2),
                "max": round(float(X_train[col].max()), 2),
                "media": round(float(X_train[col].mean()), 2),
            } for col in NUMERICAL_FEATURES
        }
    }
    with open("backend/models/contract_options.json", "w", encoding="utf-8") as f:
        json.dump(options_meta, f, indent=2, ensure_ascii=False)
    print("  • Metadados de formulário salvos em: backend/models/contract_options.json")
    
    print("\n✅ FASE 1 e FASE 2 CONCLUÍDAS COM SUCESSO!")
    print("=" * 70)


if __name__ == "__main__":
    main()
