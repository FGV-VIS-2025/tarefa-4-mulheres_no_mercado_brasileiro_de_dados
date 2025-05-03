# 📊   Visualização Interativa sobre Mulheres no Mercado de Dados brasileiro 👩‍💻


Este projeto cria uma **visualização interativa** em D3.js sobre **disparidades de gênero** relacionadas aos profissionais da área de dados no Brasil.

O código lê múltiplos arquivos CSV, gera gráficos dinâmicos e alterna entre diferentes visualizações conforme o usuário **rola a página e interage**. 


---
## A estrutura

O trabalho é estruturado em apenas um site interativo que, ao rolar a página, **cria novas visualições animadas** enquanto conta uma história que envolve o usuário com **interações entre texto e gráfico** e **interações somente no gráfico também**, proporcionando uma experiência fluida e imersiva


---

## 📈 Tipos de Gráficos

---


### - Gráficos de bolhas quantidade de pessoas por área e gênero

- Bolhas são a quantidade de pessoas em cada área e as cores por gênero:
  - ao clicar temos um zoom, mostrando mais informações, como a proporção de cada gênero na área, a média, o mínimo e o máximo salarial

- Apresenta tootltipe interação ao clicar e passar o mousse, ajudando na experiência

Esses gráficos apresenta o dataset, mostra como há mais homens do que mulheres em todas as área de dados e  conduz aos questionamentos que serão explicados. É uma ótima forma de visualizar as distribuições de homens e mulheres é cada setor e dá uma boa visão geral do dataset.

---
### - Pirâmide Salarial por Gênero
 Gráfico de barras horizontais espelhadas.
- **Eixo X**: Quantidade de pessoas em cada gênero.
- **Eixo Y**: Faixa salarial.
- **Destaques**: 
  - Linhas de referência para **salário médio** de homens e mulheres.
  
- Apresenta Tooltip ao passar o mouse sobre barras e linhas e hátambém a opção de filtrar os dados por área, para uma análise mais aprofundada da distribuição dos gêneros e médias salariais.


Escolhido para mostrar a distribuição de pessoas por gênero nas diferentes faixas salariais. Serve para analisar tanto a quantidade de pessoas de cada gênero, como também uma ampla noção das diferenças salariais.

---

### - Gráficos de Linhas com barras 

- Linhas são comparação de proporções de cada gênero em:
  - Faixa salrial
  - Nível de escolaridade.
  - Tempo de experiência.
  - Nível de Senioridade.

- Barras são as diferenças dessas proporções.


Esses gráficos em conjunto servem para explorarmos mais afundo se há - e quais são - as causas das diferenças salariais.
Analisando se as tendências femininas diferem dos homens e quanto.

---

### - Gráficos de Barras 

- Comparação de médias salariais por gênero e as variáveis:
  - nível de escolaridade.
  - tempo de experiência.
  - níveis de atuação profissional (Senioridade).

- Apresenta tootltip e interação com o texto, aqui além de destacar ao passar o mouse nos destaques do texto, também podemos fixa esse destaque clicando.

É a melhor escolha para comparar uma variável quantitativa (médias salárias) em cada categoria entre os gêneros.

---


### - Nuvem de palavras 

- Mostra os principais pontos de satisfação citados:
  - O tamanho é a quantidade de citações

- Além de tooltip, apresenta um botão de filtragem, podendo escolher apenas para um dos gêneros ou geral.

Uma forma de mostras o que é mais importante para as mulheres em um trabalho na área de dados.



---

## Desenvolvimento do projeto

#### Divisão:
O trabalho foi desenvolido em conjunto de forma bem equilibrada e cooperativa, de modo a todos os integrante ajudarem e opinarem nas escolhas e implementações.

- ##### Paula Eduarda de Lima:
  - Esqueleto do sitema de rolagem da página 
  - Gráfico de bolhas e suas interações
  - Parte das interações texto-visualização
  - Designe da página

- #### Mariana Fernandes Rocha
  - Gráfico de pirâmide e suas interações
  - Gráficos de barras e suas interações
  - Gráficos de linhas e suas interações
  - Gráfico de nuvem de palavras e suas interações
  - Parte das interações texto-visualização

---



## 📄 Referências
Inspirações de projetos de visualização de dados:

- [Inspirações de scrool interativo](https://medium.com/data-science/how-i-created-an-interactive-scrolling-visualisation-with-d3-js-and-how-you-can-too-e116372e2c73)


- [Inspirações de análise](URL-do-link)

Base da dados utilizada:
- [Kaggle - Mercado de dados no Brasil](https://www.kaggle.com/datasets/datahackers/state-of-data-2021/data)

---
## Uso de Inteligência Artificial

A utilização de inteligência artificial generativa auxiliou no projeto, atuando como ferramenta de apoio técnico, principalmente com o objetivo de entender erros de codificação e melhor entendimento das infinitas possibilidades que o D3 e javaScript apresentam. 