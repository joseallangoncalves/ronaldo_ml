import React from 'react';

const FEATURES_DATA = [
  {
    nome: 'Valor_Original',
    titulo: 'Valor Inicial Contratado (R$)',
    impacto: 0.07573,
    percent: 100,
    descricao: 'Maior determinante estatístico. Contratos com valores expressivos têm maior probabilidade de repactuação e aditivos de valor.',
  },
  {
    nome: 'duracao_planejada_dias',
    titulo: 'Duração Planejada (Dias)',
    impacto: 0.07349,
    percent: 97,
    descricao: 'Segundo fator mais crítico. Prazos superiores a 1 ano aumentam drasticamente a probabilidade de prorrogações temporais.',
  },
  {
    nome: 'Natureza_Juridica',
    titulo: 'Natureza Jurídica da Contratada',
    impacto: 0.01002,
    percent: 13,
    descricao: 'O enquadramento societário oficial da empresa perante a Receita Federal.',
  },
  {
    nome: 'tipo_ult_adit',
    titulo: 'Tipo do Último Aditivo Anterior',
    impacto: 0.00933,
    percent: 12,
    descricao: 'Indica se a empresa teve aditivo recente de prazo, valor ou ambos em contratos finalizados.',
  },
  {
    nome: 'Capital_Social_Receita',
    titulo: 'Capital Social Registrado',
    impacto: 0.00803,
    percent: 11,
    descricao: 'Capacidade patrimonial do fornecedor perante o vulto contratado.',
  },
  {
    nome: 'tx_adit_geral_5a',
    titulo: 'Taxa Geral de Aditivos (5 Anos)',
    impacto: 0.00650,
    percent: 9,
    descricao: 'Histórico consolidado de termos aditivos da contratada na Petrobras.',
  },
  {
    nome: 'tipo_fundamento_licitacao',
    titulo: 'Modalidade de Licitação (Lei 13.303/16)',
    impacto: 0.00512,
    percent: 7,
    descricao: 'Licitação Geral Art. 28, Licitação por Item ou Sistema de Registro de Preços.',
  },
  {
    nome: 'Porte_Empresa',
    titulo: 'Porte da Empresa (Receita Federal)',
    impacto: 0.00420,
    percent: 6,
    descricao: 'Enquadramento em Demais, EPP ou Microempresa.',
  },
];

export default function FeatureImportanceView() {
  return (
    <div className="feature-importance-layout animate-fade-in">
      <div className="glass-panel section-card">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">🔍 Fatores Determinantes de Risco (Feature Importance)</h2>
            <p className="section-desc">
              Avaliação computada via <strong>Permutation Feature Importance</strong> (Aula 3 do Prof. Ronaldo) sobre o conjunto de teste cego, medindo a perda de desempenho quando o atributo é embaralhado.
            </p>
          </div>
          <span className="badge badge-champion">Interpretabilidade Algorítmica</span>
        </div>

        <div className="importance-list-grid">
          {FEATURES_DATA.map((feat, idx) => (
            <div key={idx} className="importance-item-card glass-panel">
              <div className="importance-top-row">
                <span className="feat-rank">#{idx + 1}</span>
                <span className="feat-title">{feat.titulo}</span>
                <span className="feat-code"><code>{feat.nome}</code></span>
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${feat.percent}%` }}
                ></div>
              </div>

              <div className="importance-bottom-row">
                <span className="feat-desc">{feat.descricao}</span>
                <span className="feat-score">Impacto: {feat.impacto.toFixed(5)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
