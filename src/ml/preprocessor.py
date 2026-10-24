"""
Módulo de Pré-processamento, Normalização e Conformidade com LGPD.
Garante a ausência de Data Leakage ajustando transformadores apenas no conjunto de treino.
Alinhado às diretrizes do Prof. Dr. Ronaldo Martins da Costa (UFG).
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

# 1. Definição das Variáveis Autenticadas (Pré-Contratuais)
NUMERICAL_FEATURES = [
    "Valor_Original",
    "duracao_planejada_dias",
    "qtd_cont_forn_tot",
    "qtd_cont_5a_forn",
    "qtd_adit_prazo_5a",
    "tx_adit_prazo_5a",
    "qtd_adit_pv_5a",
    "tx_adit_pv_5a",
    "qtd_adit_val_5a",
    "tx_adit_val_5a",
    "tx_adit_geral_5a",
    "Capital_Social_Receita",
]

CATEGORICAL_FEATURES = [
    "tipo_fundamento_licitacao",
    "tipo_ult_adit",
    "Porte_Empresa",
    "Natureza_Juridica",
]

TARGET_COLUMN = "fl_aditivo"


def load_and_clean_data(csv_path: str = "dados/abt_modelagem_aditivos.csv") -> pd.DataFrame:
    """
    Carrega os dados e aplica filtros rígidos de LGPD e Anti-Leakage.
    """
    df = pd.read_csv(csv_path, sep=";")
    
    # Validação e conversão de Natureza_Juridica para string categórica
    df["Natureza_Juridica"] = df["Natureza_Juridica"].astype(str)
    
    # Tratamento de preenchimento para campos categóricos vazios
    for col in CATEGORICAL_FEATURES:
        df[col] = df[col].fillna("Nao_Informado").astype(str)
        
    for col in NUMERICAL_FEATURES:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)
        
    df[TARGET_COLUMN] = df[TARGET_COLUMN].astype(int)
    
    # Seleção estrita apenas dos atributos autorizados (LGPD-compliant e pré-contratuais)
    features_and_target = NUMERICAL_FEATURES + CATEGORICAL_FEATURES + [TARGET_COLUMN]
    return df[features_and_target]


def build_preprocessor() -> ColumnTransformer:
    """
    Constrói o ColumnTransformer com Normalização (StandardScaler) e One-Hot Encoding.
    Conforme as Aulas 1c e 4.1 do Prof. Ronaldo.
    """
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),  # Normalização com média 0 e desvio padrão 1
    ])
    
    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, NUMERICAL_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
        verbose_feature_names_out=False,
    )
    
    return preprocessor


def get_train_test_data(csv_path: str = "dados/abt_modelagem_aditivos.csv", test_size: float = 0.20, random_state: int = 42):
    """
    Separa os dados em 80% treino e 20% teste com amostragem estratificada,
    respeitando os guardrails da Aula 2.
    """
    df = load_and_clean_data(csv_path)
    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET_COLUMN]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    return X_train, X_test, y_train, y_test
