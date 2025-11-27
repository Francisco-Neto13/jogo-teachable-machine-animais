# Jogo de Reconhecimento de Gestos – Teachable Machine (Animais)

Um jogo interativo que utiliza um modelo treinado no **Teachable Machine** para reconhecer gestos feitos pelo jogador via webcam.  
O objetivo é imitar o animal exibido no desafio e ganhar pontos conforme a IA reconhece corretamente o gesto.

🔗 **Acesse o jogo aqui:**  
👉 https://jogo-teachable-machine-animais-6y6v.vercel.app/

---

## Sobre o Projeto

Este é um jogo educacional e divertido onde o usuário realiza gestos na frente da webcam, e um modelo de IA identifica qual animal o gesto representa.  
Quando o gesto reconhecido corresponde ao animal do desafio, o jogador pontua.

O jogo roda completamente no navegador, sem necessidade de instalação.

---

##  Tecnologias Utilizadas

### Inteligência Artificial
- **Teachable Machine** (modelo treinado com gestos próprios)
- **TensorFlow.js** para rodar o modelo diretamente no navegador

### Frontend
- **HTML**
- **CSS**
- **JavaScript**

### Imagens dos Animais
- Obtidas dinamicamente via **API Pexels**
- Requisições protegidas utilizando backend da Vercel

### Deploy
- **Vercel**
- Deploy automático a cada commit no repositório conectado

---

## Como o Jogo Funciona

1. O jogo exibe um **desafio** com o nome de um animal.  
2. O usuário tenta acertar o animal usando gestos.  
3. A webcam captura o movimento em tempo real.  
4. O modelo do Teachable Machine processa continuamente cada frame.  
5. O jogo compara o gesto reconhecido com o animal do desafio.  
6. Se estiver correto → o jogador ganha pontos.  

Há também uma **área de testes**, com logs separados, usada para visualizar o comportamento do modelo em tempo real.

---

## Segurança da API

As imagens são buscadas da **Pexels API**, porém a chave fica protegida

- A chamada acontece no backend (em `/api/pexels`)
- O frontend nunca expõe a chave ao usuário
- A Vercel fornece suporte nativo a variáveis de ambiente seguras

---

## Funcionalidades

- Reconhecimento de gestos em tempo real
- Desafios aleatórios de animais
- Pontuação automática
- Área de testes separada
- Imagens dinâmicas via API
- Interface rápida e leve
