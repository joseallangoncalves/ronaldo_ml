# Especificação do Frontend — Interface Web em React (Vite)

**Versão da UI:** `v1.0.0`  
**Tecnologia:** React 18+ com Vite  
**Estilização:** Vanilla CSS Moderno (Design Tokens, Glassmorphism, Variáveis CSS, Dark/Light Mode)  
**Localização:** `frontend/`  

---

## 1. Diretrizes de Design e Experiência do Usuário (UX/UI)

1. **Estética Profissional e Acadêmica:**
   - Visual corporativo e tecnológico compatível com a seriedade de auditorias da Petrobras e rigor acadêmico da UFG.
   - Tipografia moderna (Inter ou Outfit) para números e rótulos analíticos.
   - Paleta de cores funcional:
     - Primária: Tons de Azul Petróleo / Grafite escuro (`#0f172a`, `#1e293b`).
     - Alerta / Risco Alto: Âmbar e Coral (`#ef4444`, `#f59e0b`).
     - Sucesso / Risco Baixo: Esmeralda (`#10b981`).
     - Destaque UFG / Petrobras: Tons de ciano/dourado suave.
2. **Design Responsivo:**
   - Grid flexível com adaptação para telas widescreen, notebooks e tablets.

---

## 2. Estrutura de Componentes

```
frontend/src/
├── assets/                  # Ícones, logotipos e ilustrações
├── components/
│   ├── Header.jsx           # Cabeçalho com identificação do projeto e da disciplina
│   ├── ContractForm.jsx     # Formulário interativo com sliders e inputs numéricos
│   ├── PresetSelector.jsx   # Botões de perfil rápido ("Alto Risco", "Baixo Risco", "Novo Fornecedor")
│   ├── RiskGauge.jsx        # Indicador visual da probabilidade de aditivo com anel SVG
│   ├── ConfusionMatrix.jsx  # Matriz de Confusão interativa com explicações dos quadrantes (VP, VN, FP, FN)
│   ├── MetricsTable.jsx     # Comparativo dos algoritmos da disciplina (KNN, DT, RF, SVM, Boosting)
│   └── FeatureImportance.jsx # Gráfico em barras dos maiores indutores de aditivo
├── services/
│   └── api.js               # Camada de comunicação HTTP (fetch/axios) com o FastAPI
├── App.jsx                  # Orquestrador da aplicação com abas ("Simulador Operacional" e "Métricas Acadêmicas")
├── index.css                # Design tokens, reset e estilos globais
└── main.jsx                 # Ponto de entrada do React
```

---

## 3. Funcionalidades da Interface

### 3.1 Painel "Simulador Operacional"
- Permite que o gestor de compras da Petrobras informe as variáveis contratuais:
  - Valor inicial em R$ (com formatação monetária automática).
  - Duração prevista em dias.
  - Modalidade da licitação (Art. 28 Caput, Licitação por Item, Registro de Preços, CPSI Inovação).
  - Histórico de 5 anos do fornecedor (quantidade de contratos, histórico de aditivos de prazo/valor).
  - Porte da empresa e capital social.
- **Botões de Teste Rápido (Presets):**
  - **Cenário 1 — Fornecedor Crítico:** Empresa com alto histórico de aditivos de prazo e duração contratual elevada.
  - **Cenário 2 — Contrato Padronizado:** Duração curta, registro de preços, fornecedor com baixo índice de aditivos.
  - **Cenário 3 — Fornecedor Novo:** Primeiro contrato com a Petrobras (sem histórico nos últimos 5 anos).
- **Feedback Imediato (Card de Risco):**
  - Indicador circular (0% a 100%).
  - Classificação categórica (Baixo Risco, Risco Moderado, Alto Risco).
  - Explicação dos principais motivos que elevaram ou reduziram a probabilidade.

### 3.2 Painel "Métricas Acadêmicas (Prof. Ronaldo)"
- **Visualizador da Matriz de Confusão:**
  - $VP$: Previsto com aditivo e teve aditivo.
  - $VN$: Previsto sem aditivo e executado sem aditivo.
  - $FP$: Previsto com aditivo e executado sem aditivo.
  - $FN$: Previsto sem aditivo, mas sofreu aditivo (*Cenário de maior risco prático*).
- **Tabela de Métricas Detalhadas:**
  - Acurácia, Precisão, Sensibilidade (Recall), Especificidade e F1-Score com cards explicativos de cada conceito ensinado na Aula 2.
- **Gráfico de Importância das Variáveis:**
  - Visualização de *Permutation Feature Importance* (Aula 3), destacando quais variáveis mais afetam a decisão do modelo.

---

## 4. Integração com o Backend
- Base URL dinâmica: `http://127.0.0.1:8000`.
- Estados de UI: Loading spinners durante cálculos, alertas visuais em caso de erro de conexão, tratamento resiliente de timeout.
