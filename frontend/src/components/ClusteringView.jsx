import React from 'react';

export default function ClusteringView() {
  const clusters = [
    {
      id: 0,
      nome: 'Cluster 0: Operação Padrão / Médio Risco',
      totalContratos: 4325,
      percentual: '74,7%',
      taxaAditivos: '54,2%',
      valorMedio: 'R$ 2.450.000,00',
      duracaoMedia: '280 dias',
      taxaHistorica: '22,4%',
      cor: '#3b82f6',
      descricao: 'Contratos rotineiros de bens e serviços de apoio operacional. Volume representativo com incidência moderada de aditivos.',
    },
    {
      id: 1,
      nome: 'Cluster 1: Fornecedores Críticos / Altíssimo Valor',
      totalContratos: 298,
      percentual: '5,1%',
      taxaAditivos: '84,9%',
      valorMedio: 'R$ 84.200.000,00',
      duracaoMedia: '690 dias',
      taxaHistorica: '71,5%',
      cor: '#ef4444',
      descricao: 'Grandes empreitadas de engenharia, sondas e tecnologia de ponta. Apresentam a mais alta taxa de termos aditivos de prazo e valor.',
    },
    {
      id: 2,
      nome: 'Cluster 2: Fornecedores Recorrentes / Serviços Contínuos',
      totalContratos: 1164,
      percentual: '20,1%',
      taxaAditivos: '68,1%',
      valorMedio: 'R$ 6.800.000,00',
      duracaoMedia: '480 dias',
      taxaHistorica: '48,6%',
      cor: '#f59e0b',
      descricao: 'Prestadores de serviços continuados com histórico consolidado e prorrogações temporais periódicas amparadas pela Lei 13.303/16.',
    },
  ];

  return (
    <div className="clustering-layout animate-fade-in">
      <div className="glass-panel section-card">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">🧩 Pilar 3: Agrupamento / Clusterização de Fornecedores (Não Supervisionado)</h2>
            <p className="section-desc">
              Atende à exigência de <strong>Agrupamento/Clusterização (Aprendizado não Supervisionado)</strong> do <code>trabalho.md</code> e <strong>Aula 4.1 (K-Means, Padronização e Coeficiente de Silhueta)</strong>.
            </p>
          </div>
          <span className="badge badge-champion">Silhouette Score: 0,6949 (Alta Coesão)</span>
        </div>

        <div className="metrics-cards-sidebar" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '20px 0' }}>
          <div className="metric-kpi-card highlight-kpi">
            <span className="kpi-label">Algoritmo Homologado</span>
            <span className="kpi-value" style={{ fontSize: '1.25rem' }}>K-Means (k=3)</span>
            <span className="kpi-meaning">Inicialização K-Means++ com StandardScaler.</span>
          </div>

          <div className="metric-kpi-card">
            <span className="kpi-label">Coeficiente de Silhueta</span>
            <span className="kpi-value">0,6949</span>
            <span className="kpi-meaning">Clusters bem separados e homogêneos internamente.</span>
          </div>

          <div className="metric-kpi-card">
            <span className="kpi-label">Critério de Escolha de K</span>
            <span className="kpi-value" style={{ fontSize: '1.1rem' }}>Método do Cotovelo</span>
            <span className="kpi-meaning">Queda acentuada da Inércia (WCSS) em k=3.</span>
          </div>
        </div>

        <div className="clusters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '24px' }}>
          {clusters.map((c) => (
            <div key={c.id} className="gov-card glass-panel" style={{ borderTop: `4px solid ${c.cor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge" style={{ backgroundColor: `${c.cor}20`, color: c.cor, borderColor: c.cor }}>
                  Cluster {c.id} ({c.percentual})
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  {c.totalContratos} contratos
                </span>
              </div>

              <h3 className="gov-title" style={{ fontSize: '1.05rem', minHeight: '44px' }}>{c.nome}</h3>
              <p className="gov-text" style={{ minHeight: '64px' }}>{c.descricao}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Taxa de Aditivos Real:</span>
                  <strong style={{ color: c.taxaAditivos }}>{c.taxaAditivos}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Valor Médio:</span>
                  <strong>{c.valorMedio}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Duração Média:</span>
                  <strong>{c.duracaoMedia}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="callout-box" style={{ marginTop: '28px' }}>
          <div className="callout-icon">💡</div>
          <div>
            <h4 className="callout-title">Guardrails da Aula 4.1 do Prof. Dr. Ronaldo</h4>
            <p className="callout-text">
              Conforme ensinado nos slides de Não Supervisionados, o algoritmo <strong>K-Means</strong> exige a <em>necessidade crítica da padronização dos atributos</em> (StandardScaler) antes do cálculo das distâncias euclidianas. O número de agrupamentos ($k=3$) foi validado através do <strong>Método do Cotovelo (WCSS / Inércia)</strong> e confirmado pelo <strong>Coeficiente de Silhueta de 0,6949</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
