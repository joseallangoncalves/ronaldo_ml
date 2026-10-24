import React from 'react';

export default function ConfusionMatrixCard() {
  const matrix = {
    VP: 545,
    VN: 281,
    FP: 197,
    FN: 135,
    total: 1158,
  };

  return (
    <div className="confusion-matrix-layout animate-fade-in">
      <div className="glass-panel section-card">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">🔲 Matriz de Confusão do Modelo Campeão (Random Forest)</h2>
            <p className="section-desc">
              Distribuição observada nos <strong>1.158 contratos de teste cego</strong> (20% da base Petrobras), exatamente como formulado na <strong>Aula 2 — Treinamento e Métricas</strong>.
            </p>
          </div>
          <span className="badge badge-champion">Amostra Cega: 1.158 Contratos</span>
        </div>

        <div className="matrix-grid-container">
          {/* Visual Grid 2x2 */}
          <div className="matrix-grid">
            <div className="matrix-header-col"></div>
            <div className="matrix-header-col">Previsão: ADITIVO (1)</div>
            <div className="matrix-header-col">Previsão: SEM ADITIVO (0)</div>

            <div className="matrix-header-row">Real: ADITIVO (1)</div>
            <div className="matrix-cell cell-vp">
              <span className="cell-tag">Verdadeiro Positivo (VP)</span>
              <span className="cell-number">{matrix.VP}</span>
              <span className="cell-desc">Contratos aditivados previstos com sucesso</span>
            </div>
            <div className="matrix-cell cell-fn">
              <span className="cell-tag">Falso Negativo (FN)</span>
              <span className="cell-number">{matrix.FN}</span>
              <span className="cell-desc">Aditivos não detectados (Risco Crítico)</span>
            </div>

            <div className="matrix-header-row">Real: SEM ADITIVO (0)</div>
            <div className="matrix-cell cell-fp">
              <span className="cell-tag">Falso Positivo (FP)</span>
              <span className="cell-number">{matrix.FP}</span>
              <span className="cell-desc">Sem aditivo, mas com alerta preventivo</span>
            </div>
            <div className="matrix-cell cell-vn">
              <span className="cell-tag">Verdadeiro Negativo (VN)</span>
              <span className="cell-number">{matrix.VN}</span>
              <span className="cell-desc">Execução sem aditivo prevista corretamente</span>
            </div>
          </div>

          {/* Cards de Métricas Derivadas */}
          <div className="metrics-cards-sidebar">
            <div className="metric-kpi-card highlight-kpi">
              <span className="kpi-label">Sensibilidade (Recall)</span>
              <span className="kpi-value">80,15%</span>
              <span className="kpi-formula">VP / (VP + FN) = 545 / 680</span>
              <p className="kpi-meaning">Capacidade do modelo de capturar contratos que sofreram aditivo.</p>
            </div>

            <div className="metric-kpi-card">
              <span className="kpi-label">Precisão (Precision)</span>
              <span className="kpi-value">73,45%</span>
              <span className="kpi-formula">VP / (VP + FP) = 545 / 742</span>
              <p className="kpi-meaning">Proporção de acertos quando o modelo emite alerta de aditivo.</p>
            </div>

            <div className="metric-kpi-card">
              <span className="kpi-label">F1-Score Equilibrado</span>
              <span className="kpi-value">76,65%</span>
              <span className="kpi-formula">2 * (Prec * Rec) / (Prec + Rec)</span>
              <p className="kpi-meaning">Média harmônica que equilibra precisão e cobertura.</p>
            </div>

            <div className="metric-kpi-card">
              <span className="kpi-label">Especificidade</span>
              <span className="kpi-value">58,79%</span>
              <span className="kpi-formula">VN / (VN + FP) = 281 / 478</span>
              <p className="kpi-meaning">Identificação correta de contratos executados no prazo e valor originais.</p>
            </div>

            <div className="metric-kpi-card">
              <span className="kpi-label">Acurácia Geral</span>
              <span className="kpi-value">71,33%</span>
              <span className="kpi-formula">(VP + VN) / Total = 826 / 1158</span>
              <p className="kpi-meaning">Proporção total de acertos em todo o conjunto de teste.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
