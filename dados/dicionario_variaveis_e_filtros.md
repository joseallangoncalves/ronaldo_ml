# Dicionário de Variáveis e Filtros da ABT

## 1. Filtros Aplicados

| Campo | Regra / Valores Selecionados |
| :--- | :--- |
| **`Fundamento_Legal`** | • `Licitação, Lei 13.303, Art. 28, CAPUT`<br>• `Licitação, Lei 13.303, Art. 28 CAPUT - licitação por item`<br>• `Sistema de Registros de Preços - Licitação, Lei 13.303/16, Art.66`<br>• `Licitação - Lei Complementar nº 182, Capítulo IV - CPSI Solução Inovador` |
| **`Numero_Contrato`** | `Numero_Contrato > 4.600.000.000` (Série 46) |
| **`Situacao`** | • `Concluído`<br>• `Concluído - recisão`<br>• `Concluído - distrato` |
| **`Qtd_Aditivos`** | Coluna removida |

---

## 2. Lista e Significado das Variáveis

| Variável | Tipo | Significado / Descrição |
| :--- | :---: | :--- |
| **`Numero_Contrato`** | Texto | Número identificador do contrato na Petrobras (Série 46). |
| **`fl_aditivo`** | Inteiro | **Variável Resposta (Alvo):** 1 se o contrato teve aditivo, 0 se não teve. |
| **`Fornecedor`** | Texto | Razão social / Nome empresarial cadastrado no sistema da Petrobras. |
| **`CNPJ`** | Texto | CNPJ de 14 dígitos da empresa contratada. |
| **`Situacao`** | Texto | Situação final do contrato (*Concluído*, *Concluído - recisão*, *Concluído - distrato*). |
| **`Inicio_Vigencia`** | Data | Data de início da vigência do contrato. |
| **`Fim_Vigencia`** | Data | Data prevista de término da vigência estipulada no edital original. |
| **`Valor_Original`** | Decimal | Valor total inicial contratado em Reais (R$). |
| **`duracao_planejada_dias`** | Inteiro | Duração prevista em dias entre o início e o fim da vigência original. |
| **`Fundamento_Legal`** | Texto | Descrição completa do fundamento legal de licitação. |
| **`tipo_fundamento_licitacao`** | Texto | Categoria da licitação (*Licitacao_Geral_Art28*, *Licitacao_Por_Item*, *Registro_Precos*, *CPSI_Inovacao*). |
| **`qtd_cont_forn_tot`** | Inteiro | Total de contratos prévios que o fornecedor já teve na Petrobras em todo o histórico. |
| **`qtd_cont_5a_forn`** | Inteiro | Volume real de contratos entregues/finalizados pelo fornecedor nos 5 anos anteriores (Denominador sem filtro de objeto ou fundamento legal). |
| **`qtd_adit_prazo_5a`** | Inteiro | Contratos do fornecedor (últimos 5 anos finalizados) que sofreram aditivo de prazo. |
| **`tx_adit_prazo_5a`** | Decimal | Taxa de contratos do fornecedor (últimos 5 anos) com aditivo de prazo: $\frac{\text{qtd\_adit\_prazo\_5a}}{\text{qtd\_cont\_5a\_forn}}$. |
| **`qtd_adit_pv_5a`** | Inteiro | Contratos do fornecedor (últimos 5 anos finalizados) com aditivo conjunto de prazo e valor. |
| **`tx_adit_pv_5a`** | Decimal | Taxa de contratos do fornecedor (últimos 5 anos) com aditivo de prazo e valor: $\frac{\text{qtd\_adit\_pv\_5a}}{\text{qtd\_cont\_5a\_forn}}$. |
| **`qtd_adit_val_5a`** | Inteiro | Contratos do fornecedor (últimos 5 anos finalizados) com aditivo de valor. |
| **`tx_adit_val_5a`** | Decimal | Taxa de contratos do fornecedor (últimos 5 anos) com aditivo de valor: $\frac{\text{qtd\_adit\_val\_5a}}{\text{qtd\_cont\_5a\_forn}}$. |
| **`tx_adit_geral_5a`** | Decimal | Taxa geral de contratos do fornecedor (últimos 5 anos) com qualquer aditivo: $\frac{\text{contratos com qualquer aditivo}}{\text{qtd\_cont\_5a\_forn}}$. |
| **`tipo_ult_adit`** | Texto | Tipo do último aditivo anterior do fornecedor (*Prazo_e_Valor*, *Prazo*, *Valor* ou *Nenhum*). |
| **`Objeto`** | Texto | Descrição do objeto contratado. |
| **`Saldo_Bruto`** | Decimal | Saldo bruto residual apurado ao término do contrato. |
| **`Saldo_Inativo`** | Decimal | Saldo inativo apurado no encerramento contábil. |
| **`CNPJ_Basico`** | Texto | 8 primeiros dígitos do CNPJ da matriz do fornecedor. |
| **`Razao_Social_Receita`** | Texto | Razão social oficial registrada na Receita Federal. |
| **`Natureza_Juridica`** | Inteiro | Código oficial da natureza jurídica na Receita Federal (ex: 2062). |
| **`Qualificacao_Responsavel`** | Inteiro | Código de qualificação do responsável legal na Receita Federal. |
| **`Capital_Social_Receita`** | Decimal | Capital social da empresa registrado na Receita Federal em Reais (R$). |
| **`Codigo_Porte`** | Texto | Código de porte da empresa na Receita Federal. |
| **`Porte_Empresa`** | Texto | Descrição do porte na Receita Federal (*Microempresa*, *EPP*, *Demais*, *Não Informado*). |
| **`Ente_Federativo_Responsavel`** | Texto | Ente federativo associado (quando órgão público). |
| **`Qtd_Aditivos_Total`** | Inteiro | Quantidade total de aditivos celebrados no contrato. |
| **`Qtd_Aditivos_Prazo_e_Valor`** | Inteiro | Quantidade de aditivos simultâneos de prazo e valor do contrato. |
| **`Qtd_Aditivos_Valor`** | Inteiro | Quantidade de aditivos exclusivamente de valor do contrato. |
| **`Qtd_Aditivos_Prazo`** | Inteiro | Quantidade de aditivos exclusivamente de prazo do contrato. |
| **`Qtd_Aditivos_Sem_Impacto`** | Inteiro | Quantidade de aditivos administrativos sem impacto financeiro ou de prazo. |
| **`Qtd_Aditivos_Outros`** | Inteiro | Quantidade de outros aditivos do contrato. |
| **`Moedas_Aditivos`** | Texto | Moedas registradas nos aditivos do contrato (*R$*, *US$*, *EUR*, etc.). |
| **`Valor_Aditivado_BRL`** | Decimal | Soma dos valores aditivados em Reais (R$) deste contrato. |
| **`Valor_Aditivado_USD`** | Decimal | Soma dos valores aditivados em Dólares (US$) deste contrato. |
| **`Valor_Aditivado_EUR`** | Decimal | Soma dos valores aditivados em Euros (EUR) deste contrato. |
| **`Valor_Aditivado_Outras`** | Decimal | Soma dos aditivos em outras moedas deste contrato. |
| **`Data_Primeiro_Aditivo`** | Data | Data de assinatura do primeiro aditivo do contrato. |
| **`Data_Ultimo_Aditivo`** | Data | Data de assinatura do último aditivo do contrato. |
| **`Inicio_Vigencia_Com_Aditivo`** | Data | Data de início de vigência atualizada pelos aditivos. |
| **`Fim_Vigencia_Com_Aditivo`** | Data | Data final de vigência oficial atualizada após os aditivos. |
