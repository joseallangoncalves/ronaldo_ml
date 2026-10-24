import React from 'react';

const MODELS_DATA = [
  {
    nome: 'Random Forest',
    campeao: true,
    familia: 'Ensemble (Bagging)',
    acuracia: '71,33%',
    recall: '80,15%',
    especificidade: '58,79%',
    f1: '76,65%',
    auc: '0,7714',
    destaque: 'Campeão da Disciplina: Maximiza a detecção de aditivos (80,15%), minimizando surpresas financeiras e Falsos Negativos.',
  },
  {
    nome: 'Gradient Boosting',
    campeao: false,
    familia: 'Ensemble (Boosting)',
    acuracia: '71,24%',
    recall: '78,53%',
    especificidade: '60,88%',
    f1: '76,23%',
    auc: '0,7656',
    destaque: 'Excelente convergência sequencial com taxa de aprendizado controlada.',
  },
  {
    nome: 'Árvore de Decisão',
    campeao: false,
    familia: 'Árvores (Critério Gini)',
    acuracia: '70,29%',
    recall: '75,88%',
    especificidade: '62,34%',
    f1: '75,00%',
    auc: '0,7430',
    destaque: 'Alta interpretabilidade das regras de corte, conforme Aula 3 do Prof. Ronaldo.',
  },
  {
    nome: 'KNN (k=5)',
    campeao: false,
    familia: 'Baseado em Distância',
    acuracia: '65,98%',
    recall: '71,32%',
    especificidade: '58,37%',
    f1: '71,11%',
    auc: '0,7159',
    destaque: 'Sensível à escala das variáveis; necessita obrigatoriamente de StandardScaler.',
  },
  {
    nome: 'Regressão Logística',
    campeao: false,
    familia: 'Linear Discriminativo',
    acuracia: '62,61%',
    recall: '76,91%',
    especificidade: '42,26%',
    f1: '70,72%',
    auc: '0,6918',
    destaque: 'Benchmark linear inicial (Aula 1c e 2). Baixa especificidade frente aos métodos não lineares.',
  },
];

export default function ModelsComparison() {
  return (
    <div className="models-comparison-layout animate-fade-in">
      <div className="glass-panel section-card">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">📊 Comparativo dos Algoritmos — Aulas do Prof. Ronaldo</h2>
            <p className="section-desc">
              Avaliação cega realizada sobre <strong>1.158 contratos reais</strong> nunca vistos durante o treinamento, com validação cruzada 5-Fold e dados padronizados com <em>StandardScaler</em>.
            </p>
          </div>
          <span className="badge badge-champion">🏆 Algoritmo Escolhido: Random Forest</span>
        </div>

        <div className="table-responsive">
          <table className="models-table">
            <thead>
              <tr>
                <th>Algoritmo / Família</th>
                <th>Sensibilidade (Recall)</th>
                <th>F1-Score</th>
                <th>Acurácia</th>
                <th>Especificidade</th>
                <th>ROC-AUC</th>
                <th>Avaliação Acadêmica</th>
              </tr>
            </thead>
            <tbody>
              {MODELS_DATA.map((item, idx) => (
                <tr key={idx} className={item.campeao ? 'row-champion' : ''}>
                  <td className="model-name-cell">
                    <div className="model-name-wrapper">
                      <span className="model-name">{item.nome}</span>
                      {item.campeao && <span className="trophy-tag">🏆 CAMPEÃO</span>}
                    </div>
                    <span className="model-family">{item.familia}</span>
                  </td>
                  <td>
                    <span className={`metric-badge ${item.campeao ? 'highlight-metric' : ''}`}>
                      {item.recall}
                    </span>
                  </td>
                  <td>
                    <span className="metric-badge">{item.f1}</span>
                  </td>
                  <td>
                    <span className="metric-text">{item.acuracia}</span>
                  </td>
                  <td>
                    <span className="metric-text">{item.especificidade}</span>
                  </td>
                  <td>
                    <span className="metric-text">{item.auc}</span>
                  </td>
                  <td className="model-notes-cell">{item.destaque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="callout-box">
          <div className="callout-icon">💡</div>
          <div>
            <h4 className="callout-title">Por que o Random Forest foi o modelo selecionado?</h4>
            <p className="callout-text">
              Na auditoria e governança de contratos da Petrobras (Lei 13.303/16), o impacto de um <strong>Falso Negativo ($FN$)</strong> — contratar presumindo que não haverá alteração e ser surpreendido por um aditivo de milhões de reais com paralisação da obra — é imensamente mais gravoso do que um Falso Positivo. Por isso, conforme ensinado na <strong>Aula 2</strong>, o modelo com a maior <strong>Sensibilidade (Recall de 80,15%)</strong> e melhor <strong>F1-Score (76,65%)</strong> foi homologado como o campeão para implementação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
