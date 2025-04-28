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
  - ao clicar temos um zoom, mostrando mais informações


Esses gráficos apresenta o dataset, mostra como há mais homens do que mulheres na área de dados e  conduz aos questionamentos que serão explicados. É uma ótima forma de visualizar as distribuições de homens e mulheres é cada setor.

---
### - Pirâmide Salarial por Gênero
- **Descrição**: Gráfico de barras horizontais espelhadas.
- **Eixo X**: Quantidade de pessoas (negativo para mulheres, positivo para homens).
- **Eixo Y**: Faixa salarial.
- **Destaques**: 
  - Linhas de referência para **salário médio** de homens e mulheres.
  - **Tooltip** ao passar o mouse sobre barras.


Escolhido para mostrar a distribuição de pessoas por geênero nas diferentes faixas salariais. Serve para analisar tanto a quantidade de pessoas de cada gênero, como também uma ampla noção das diferenças salariais.

---

### - Gráficos de Linhas com barras 

- Linhas são comparação de proporções de cada gênero em:
  - Faixa salrial
  - Nível de escolaridade.
  - Tempo de experiência.
  - Nível de Senioridade.

- Barras são as diferenças dessas proporçõe.

Esses gráficos em conjunto servem para explorarmos mais afundo se há-e quais são-as causas das diferenças salariais.
Analisando se as tendências femininas diferem dos homens e quanto.

---

### - Gráficos de Barras 

- Comparação de médias salariais por gênero e as variáveis:
  - nível de escolaridade.
  - tempo de experiência.
  - níveis de atuação profissional (Senioridade).

  É a melhor escolha para comparar uma variável quantitativa (médias salárias) em cada categoria entre os gêneros.

---


### - Nuvem de palavras 

- Mostra os principais pontos de satisfação citados:
  - A cor é determinada se proporcionalmente foi mais citada por homens ou mulheres.
  - O tamanho é a quantidade de citações

Uma forma de mostras o que é mais importante para as mulheres em um trabalho na área de dados.

---

## 📄 Referências
Inspirações de projetos de visualização de dados:

- [Inspirações de scrool interativo](https://medium.com/data-science/how-i-created-an-interactive-scrolling-visualisation-with-d3-js-and-how-you-can-too-e116372e2c73)


- [Inspirações de análise](URL-do-link)


---
