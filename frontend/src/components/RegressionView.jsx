import React from 'react';

export default function RegressionView() {
  const regMetrics = {
    modelo: 'Regressão Linear Múltipla com StandardScaler',
    r2_score: '0,7184',
    mae_brl: 'R$ 5.017.167,13',
    rmse_brl: 'R$ 14.544.423,67',
    formula: 'Valor_Aditivado = β₀ + β₁·Valor_Original + β₂·Duração + β₃·Taxa_Adit + β₄·Capital + β₅·Contratos',
  };

  const modelsRegression = [
    { nome: 'Regressão Linear Múltipla (Aula 1c)', r2: '0,7184', mae: 'R$ 5.017.167,13', rmse: 'R$ 14.544.423,67', status: '🏆 Campeão da Regressão' },
    { nome: 'Regularização Ridge (L2)', r2: '0,7183', mae: 'R$ 5.017.616,36', rmse: 'R$ 14.547.323,20', status: 'Excelente estabilidade' },
    { nome: 'Random Forest Regressor', r2: '0,2178', mae: 'R$ 4.808.043,22', rmse: 'R$ 24.239.421,21', status: 'Sensível a outliers extremos de valor' },
  ];

  return (
    <div className="regression-layout animate-fade-in">
      <div className="glass-panel section-card">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">📈 Pilar 2: Previsão de Impacto Financeiro (Regressão Supervisionada)</h2>
            <p className="section-desc">
              Atende à exigência de <strong>Previsão (Regressão)</strong> do <code>trabalho.md</code> e <strong>Aula 1c (Regressão Linear & Gradiente Descendente)</strong>. Modela o valor contínuo em Reais (R$) a ser aditivado nos contratos.
            </p>
          </div>
          <span className="badge badge-champion">R² = 0,7184 (Excelente Aderência)</span>
        </div>

        <div className="metrics-cards-sidebar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '20px 0' }}>
          <div className="metric-kpi-card highlight-kpi">
            <span className="kpi-label">Coeficiente de Determinação R²</span>
            <span className="kpi-value">{regMetrics.r2_score}</span>
            <span className="kpi-meaning">71,84% da variação financeira explicada pelo modelo.</span>
          </div>

          <div className="metric-kpi-card">
            <span className="kpi-label">Erro Médio Absoluto (MAE)</span>
            <span className="kpi-value" style={{ fontSize: '1.25rem' }}>{regMetrics.mae_brl}</span>
            <span className="kpi-meaning">Desvio médio direto nas estimativas em Reais.</span>
          </div>

          <div className="metric-kpi-card">
            <span className="kpi-label">Raiz do Erro Quadrático (RMSE)</span>
            <span className="kpi-value" style={{ fontSize: '1.25rem' }}>{regMetrics.rmse_brl}</span>
            <span className="kpi-meaning">Penalização quadrática conforme Aula 1c.</span>
          </div>

          <div className="metric-kpi-card">
            <span className="kpi-label">Algoritmo Escolhido</span>
            <span className="kpi-value" style={{ fontSize: '1.1rem' }}>Regressão Linear</span>
            <span className="kpi-meaning">Padronização com StandardScaler.</span>
          </div>
        </div>

        <div className="table-responsive" style={{ marginTop: '24px' }}>
          <table className="models-table">
            <thead>
              <tr>
                <th>Modelo de Regressão</th>
                <th>R² Score</th>
                <th>Erro Médio Absoluto (MAE)</th>
                <th>RMSE (Raiz do MSE)</th>
                <th>Status / Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {modelsRegression.map((m, idx) => (
                <tr key={idx} className={idx === 0 ? 'row-champion' : ''}>
                  <td className="model-name-cell">
                    <span className="model-name">{m.nome}</span>
                  </td>
                  <td><span className="metric-badge">{m.r2}</span></td>
                  <td><span className="metric-text">{m.mae}</span></td>
                  <td><span className="metric-text">{m.rmse}</span></td>
                  <td><span className="trophy-tag">{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="callout-box" style={{ marginTop: '28px' }}>
          <div className="callout-icon">💡</div>
          <div>
            <h4 className="callout-title">Conceitos das Aulas 1 e 1c do Prof. Ronaldo</h4>
            <p className="callout-text">
              Na regressão linear múltipla, o gradiente descendente minimiza a função de perda MSE (Mean Squared Error). A normalização prévia com <code>StandardScaler</code> é fundamental para garantir que variáveis em escalas de dezenas de milhões (como o valor do contrato) convirjam harmoniosamente com variáveis de contagem e taxas (0 a 1).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
