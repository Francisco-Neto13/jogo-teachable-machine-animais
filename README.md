#  Jogo de Reconhecimento de Gestos – Teachable Machine (Animais)

Um projeto interativo que utiliza um modelo treinado no **Teachable Machine** para reconhecer gestos feitos pelo usuário via webcam.  
O objetivo principal do projeto é **experimentar IA, testar sinais e entender o comportamento do modelo em tempo real**.  
O mini-jogo de animais é um **extra**, criado para tornar o processo mais divertido e prático.

🔗 **Acesse o jogo:**  
👉 https://jogo-teachable-machine-animais-6y6v.vercel.app/

---

##  Sobre o Projeto

Este repositório demonstra como integrar um modelo do **Teachable Machine** com uma aplicação web real, capturando gestos do usuário pela webcam e classificando-os em tempo real.

O foco do projeto é:

- Testar o modelo
- Visualizar previsões
- Entender estabilidade dos sinais
- Criar uma interface clara para analisar os resultados

Como extra, foi criado um **joguinho educativo**, onde o usuário tenta imitar um animal exibido na tela, e a IA valida se o gesto está correto.

O projeto roda 100% no navegador, sem instalação.

---

## Tecnologias Utilizadas

### Inteligência Artificial
- **Teachable Machine** – modelo treinado com gestos personalizados  
- **TensorFlow.js** – execução do modelo diretamente no navegador

###  Frontend
- **HTML**
- **CSS**
- **JavaScript**

###  Imagens dos Animais
- Obtidas dinamicamente via **API Pexels**
- As requisições são protegidas pelo backend serverless da Vercel

###  Deploy
- **Vercel**
- Deploy automático a cada commit

---

##  Como o Jogo Funciona

1. Um animal é sorteado como desafio.  
2. O usuário tenta imitar o gesto correspondente.  
3. A webcam captura os movimentos e envia para o modelo.  
4. O Teachable Machine classifica continuamente cada frame.  
5. Se o gesto reconhecido combinar com o animal exibido → o jogador pontua.

Além disso, há uma **área de testes independente**, usada para:

- Ver resultados do modelo em tempo real  
- Analisar estabilidade da predição  
- Confirmar manualmente o palpite  
- Observar logs separados do jogo e do modelo

---

## Segurança da API

As imagens são buscadas da **Pexels API**, mas a chave NUNCA fica exposta:

- O frontend chama `/api/pexels`
- O backend serverless repassa a requisição
- A Vercel gerencia a variável de ambiente de forma segura

O usuário final não tem acesso à chave, mesmo inspecionando o código.

---

## Funcionalidades

- Reconhecimento de gestos em tempo real  
- Área completa de testes do modelo  
- Desafios aleatórios de animais  
- Pontuação automática  
- Logs independentes (teste e jogo)  
- Imagens dinâmicas via API  
- Interface leve e responsiva  

---
