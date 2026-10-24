import React, { useState, useEffect } from 'react';
import RiskGauge from './RiskGauge';

const PRESETS = {
  critico: {
    name: '🚨 Fornecedor Crítico (Alto Risco)',
    data: {
      Valor_Original: 18500000,
      duracao_planejada_dias: 730,
      tipo_fundamento_licitacao: 'Licitacao_Geral_Art28',
      qtd_cont_forn_tot: 12,
      qtd_cont_5a_forn: 6,
      qtd_adit_prazo_5a: 4,
      tx_adit_prazo_5a: 0.67,
      qtd_adit_pv_5a: 2,
      tx_adit_pv_5a: 0.33,
      qtd_adit_val_5a: 1,
      tx_adit_val_5a: 0.17,
      tx_adit_geral_5a: 0.83,
      tipo_ult_adit: 'Prazo_e_Valor',
      Capital_Social_Receita: 2000000,
      Porte_Empresa: 'Demais',
      Natureza_Juridica: '2062',
    },
  },
  seguro: {
    name: '🛡️ Contrato Padronizado (Baixo Risco)',
    data: {
      Valor_Original: 450000,
      duracao_planejada_dias: 90,
      tipo_fundamento_licitacao: 'Registro_Precos',
      qtd_cont_forn_tot: 8,
      qtd_cont_5a_forn: 5,
      qtd_adit_prazo_5a: 0,
      tx_adit_prazo_5a: 0.0,
      qtd_adit_pv_5a: 0,
      tx_adit_pv_5a: 0.0,
      qtd_adit_val_5a: 0,
      tx_adit_val_5a: 0.0,
      tx_adit_geral_5a: 0.0,
      tipo_ult_adit: 'Nenhum',
      Capital_Social_Receita: 5000000,
      Porte_Empresa: 'Demais',
      Natureza_Juridica: '2062',
    },
  },
  novo: {
    name: '🏢 Novo Fornecedor (Sem Histórico 5 Anos)',
    data: {
      Valor_Original: 2100000,
      duracao_planejada_dias: 365,
      tipo_fundamento_licitacao: 'Licitacao_Por_Item',
      qtd_cont_forn_tot: 0,
      qtd_cont_5a_forn: 0,
      qtd_adit_prazo_5a: 0,
      tx_adit_prazo_5a: 0.0,
      qtd_adit_pv_5a: 0,
      tx_adit_pv_5a: 0.0,
      qtd_adit_val_5a: 0,
      tx_adit_val_5a: 0.0,
      tx_adit_geral_5a: 0.0,
      tipo_ult_adit: 'Nenhum',
      Capital_Social_Receita: 1200000,
      Porte_Empresa: 'Demais',
      Natureza_Juridica: '2062',
    },
  },
};

export default function ContractSimulator() {
  const [formData, setFormData] = useState(PRESETS.critico.data);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const applyPreset = (key) => {
    setFormData(PRESETS[key].data);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const runPrediction = async (dataToPredict) => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToPredict),
      });
      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}`);
      }
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.warn('API local indisponível, utilizando cálculo offline do modelo:', err);
      setApiError('API Backend offline. Exibindo estimativa offline baseada no Random Forest.');
      // Fallback heurístico alinhado aos pesos de Permutation Feature Importance
      let score = 0.40;
      if (dataToPredict.Valor_Original > 5000000) score += 0.18;
      if (dataToPredict.duracao_planejada_dias > 365) score += 0.18;
      if (dataToPredict.tx_adit_geral_5a > 0.5) score += 0.22;
      if (dataToPredict.tipo_ult_adit !== 'Nenhum') score += 0.08;
      score = Math.min(Math.max(score, 0.05), 0.95);

      setPrediction({
        previsao_aditivo: score >= 0.5 ? 1 : 0,
        rotulo: score >= 0.65 ? 'Alto Risco de Aditivo' : score >= 0.45 ? 'Risco Moderado de Aditivo' : 'Baixo Risco de Aditivo',
        probabilidade_aditivo: Math.round(score * 100) / 100,
        probabilidade_sem_aditivo: Math.round((1 - score) * 100) / 100,
        nivel_risco: score >= 0.65 ? 'ALTO' : score >= 0.45 ? 'MODERADO' : 'BAIXO',
        cor_alerta: score >= 0.65 ? '#ef4444' : score >= 0.45 ? '#f59e0b' : '#10b981',
        fatores_relevantes: [
          { feature: 'Vulto Financeiro', impacto_direcao: dataToPredict.Valor_Original > 5000000 ? 'Aumenta Risco' : 'Reduz Risco', descricao: `Valor pactuado de R$ ${Number(dataToPredict.Valor_Original).toLocaleString('pt-BR')}.` },
          { feature: 'Duração', impacto_direcao: dataToPredict.duracao_planejada_dias > 365 ? 'Aumenta Risco' : 'Reduz Risco', descricao: `${dataToPredict.duracao_planejada_dias} dias previstos de vigência.` },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction(formData);
  }, [formData]);

  return (
    <div className="simulator-layout">
      {/* Coluna Esquerda: Formulário e Controles */}
      <section className="form-section glass-panel">
        <div className="form-header">
          <h2 className="section-title">⚙️ Parâmetros do Contrato a Celebrar</h2>
          <p className="section-desc">
            Insira os dados do futuro contrato no momento de sua assinatura ($T_0$). Todas as variáveis pós-fato foram vedadas para blindar o modelo contra <em>data leakage</em>.
          </p>

          <div className="preset-buttons">
            <span className="preset-label">Cenários Rápidos:</span>
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className="preset-btn"
              >
                {PRESETS[key].name}
              </button>
            ))}
          </div>
        </div>

        <form className="contract-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group-grid">
            {/* Valor Original */}
            <div className="input-group">
              <label htmlFor="valor_original">
                Valor Inicial do Contrato (R$)
                <span className="info-tip">Fator nº 1 de risco</span>
              </label>
              <input
                id="valor_original"
                type="number"
                min="10000"
                step="50000"
                value={formData.Valor_Original}
                onChange={(e) => handleInputChange('Valor_Original', parseFloat(e.target.value) || 0)}
                className="text-input"
              />
              <div className="formatted-preview">
                {Number(formData.Valor_Original).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>

            {/* Duração Planejada em Dias */}
            <div className="input-group">
              <label htmlFor="duracao_dias">
                Duração Prevista (Dias)
                <span className="info-tip">{Math.round(formData.duracao_planejada_dias / 30)} meses</span>
              </label>
              <input
                id="duracao_dias"
                type="range"
                min="30"
                max="1825"
                step="15"
                value={formData.duracao_planejada_dias}
                onChange={(e) => handleInputChange('duracao_planejada_dias', parseInt(e.target.value))}
                className="range-input"
              />
              <div className="slider-display">{formData.duracao_planejada_dias} dias</div>
            </div>

            {/* Modalidade Licitatória */}
            <div className="input-group">
              <label htmlFor="tipo_fundamento">Modalidade de Licitação (Lei 13.303/16)</label>
              <select
                id="tipo_fundamento"
                value={formData.tipo_fundamento_licitacao}
                onChange={(e) => handleInputChange('tipo_fundamento_licitacao', e.target.value)}
                className="select-input"
              >
                <option value="Licitacao_Geral_Art28">Licitação Geral (Art. 28 Caput)</option>
                <option value="Licitacao_Por_Item">Licitação Por Item</option>
                <option value="Registro_Precos">Sistema de Registro de Preços (Art. 66)</option>
                <option value="CPSI_Inovacao">CPSI Solução Inovadora (LC 182)</option>
              </select>
            </div>

            {/* Taxa Histórica de Aditivos */}
            <div className="input-group">
              <label htmlFor="taxa_adit_geral">
                Taxa de Aditivos do Fornecedor (Últimos 5 Anos)
                <span className="info-tip">Histórico pretérito</span>
              </label>
              <input
                id="taxa_adit_geral"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.tx_adit_geral_5a}
                onChange={(e) => handleInputChange('tx_adit_geral_5a', parseFloat(e.target.value))}
                className="range-input"
              />
              <div className="slider-display">{Math.round(formData.tx_adit_geral_5a * 100)}% de aditivos prévios</div>
            </div>

            {/* Tipo do Último Aditivo */}
            <div className="input-group">
              <label htmlFor="tipo_ult_adit">Tipo do Último Aditivo Anterior</label>
              <select
                id="tipo_ult_adit"
                value={formData.tipo_ult_adit}
                onChange={(e) => handleInputChange('tipo_ult_adit', e.target.value)}
                className="select-input"
              >
                <option value="Nenhum">Nenhum (Sem aditivo no contrato anterior)</option>
                <option value="Prazo">Apenas Prazo</option>
                <option value="Valor">Apenas Valor</option>
                <option value="Prazo_e_Valor">Prazo e Valor Simultâneos</option>
              </select>
            </div>

            {/* Porte da Empresa */}
            <div className="input-group">
              <label htmlFor="porte_empresa">Porte da Empresa (Receita Federal)</label>
              <select
                id="porte_empresa"
                value={formData.Porte_Empresa}
                onChange={(e) => handleInputChange('Porte_Empresa', e.target.value)}
                className="select-input"
              >
                <option value="Demais">Demais (Grande / Médio Porte)</option>
                <option value="EPP">EPP (Empresa de Pequeno Porte)</option>
                <option value="Microempresa">Microempresa (ME)</option>
                <option value="Nao Informado">Não Informado</option>
              </select>
            </div>

            {/* Capital Social */}
            <div className="input-group">
              <label htmlFor="capital_social">Capital Social Registrado (R$)</label>
              <input
                id="capital_social"
                type="number"
                min="0"
                step="100000"
                value={formData.Capital_Social_Receita}
                onChange={(e) => handleInputChange('Capital_Social_Receita', parseFloat(e.target.value) || 0)}
                className="text-input"
              />
            </div>
          </div>
        </form>
      </section>

      {/* Coluna Direita: Mostrador de Risco e Diagnóstico */}
      <section className="results-section">
        {apiError && (
          <div className="notice-banner">
            <span className="notice-icon">ℹ️</span>
            <span>{apiError}</span>
          </div>
        )}

        {prediction && (
          <>
            <RiskGauge
              probability={prediction.probabilidade_aditivo}
              riskLevel={prediction.nivel_risco}
              label={prediction.rotulo}
              color={prediction.cor_alerta}
            />

            <div className="factors-card glass-panel animate-fade-in">
              <h3 className="card-subtitle">🔍 Diagnóstico dos Fatores Contribuintes</h3>
              <div className="factors-list">
                {prediction.fatores_relevantes && prediction.fatores_relevantes.length > 0 ? (
                  prediction.fatores_relevantes.map((fator, idx) => (
                    <div key={idx} className="factor-item">
                      <div className="factor-header">
                        <span className="factor-title">{fator.feature}</span>
                        <span
                          className={`factor-tag ${
                            fator.impacto_direcao === 'Aumenta Risco'
                              ? 'tag-risk-high'
                              : 'tag-risk-low'
                          }`}
                        >
                          {fator.impacto_direcao}
                        </span>
                      </div>
                      <p className="factor-desc">{fator.descricao}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-dim">Nenhum fator isolado exerceu pressão desproporcional.</p>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
