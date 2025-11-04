# Jogo de Classificação de Animais (Teachable Machine & TensorFlow.js)

Este projeto é um jogo interativo que utiliza um modelo de Machine Learning (ML) treinado no Google Teachable Machine para classificar imagens de 4 animais: **Gato, Cachorro, Vaca e Cavalo**. O desafio do jogo é adivinhar qual animal está escondido, sendo influenciado pela previsão de "confiança" do modelo, exibida antes da revelação da imagem.

## Funcionalidades Principais

* **Previsão de Influência:** As porcentagens de classificação do modelo são exibidas antes do palpite, guiando (ou confundindo) o usuário.
* **Sequência de Acertos (Streak):** Sistema de pontuação que acompanha os acertos consecutivos.
* **Placar:** Contagem total de pontos na tela.
* **Design Minimalista:** Interface limpa com imagem de interrogação padrão, botões de ação uniformes (azuis) e cores neutras.

---

## Tecnologias Utilizadas

| Tecnologia | Tipo | Função no Projeto |
| :--- | :--- | :--- |
| **HTML5** | Estrutura | Esqueleto da aplicação e organização dos elementos. |
| **CSS3** | Estilização | Design visual, centralização e estilo uniforme de botões. |
| **JavaScript (ES6+)** | Lógica Front-end | Controle do jogo, placar, sorteio de imagens e manipulação do DOM. |
| **TensorFlow.js** | ML Library | Carregamento e execução do modelo de classificação no navegador. |
| **Teachable Machine** | Treinamento | Plataforma utilizada para criar e exportar o modelo de 4 classes. |
| **Node.js (`http-server`)** | Ambiente de Execução | Necessário apenas para hospedar os arquivos localmente e contornar restrições de segurança do navegador ao carregar o modelo. |

---

## Como o Jogo Funciona (Lógica)

O jogo opera em um ciclo contínuo de rodadas, focado em duas etapas principais que definem a experiência do usuário:

1.  **Pré-Palpite (Previsão de Confiança):**
    * Um animal é sorteado aleatoriamente e a imagem real é carregada na memória (mas não na tela).
    * A imagem exibida é apenas uma **interrogação (`?`)**.
    * O código usa o **TensorFlow.js** para classificar a imagem da interrogação.
    * O resultado dessa classificação (as 4 porcentagens) é exibido no `#label-container`, tentando influenciar o palpite do usuário.

2.  **Pós-Palpite (Revelação e Pontuação):**
    * O usuário clica no botão de palpite.
    * A imagem da interrogação é **substituída** pela imagem real do animal sorteado.
    * O palpite do usuário é verificado contra a classe real do animal.
    * **Acerto:** A pontuação (`Pontos`) aumenta em +1, e a sequência (`Streak`) é incrementada.
    * **Erro:** A sequência (`Streak`) é resetada para 0.
    * Após 2.5 segundos de feedback, a rodada é reiniciada.

---

## ▶️ Como rodar o projeto localmente

Para que os arquivos do modelo (`.json` e `.bin`) sejam carregados corretamente, o projeto deve ser executado através de um servidor web local.

### Pré-requisitos

Você precisa ter o **Node.js** (que inclui o NPM) instalado em seu sistema.

### Passo a Passo

1.  **Instalar o Servidor Local:**
    Se você ainda não tem o `http-server` instalado globalmente, use o NPM:

    ```bash
    npm install -g http-server
    ```

2.  **Clonar o Repositório e Navegar:**
    Clone o projeto do GitHub e entre na pasta:

    ```bash
    git clone [COLOQUE AQUI O URL DO SEU REPOSITÓRIO]
    cd nome-do-repositorio
    ```

3.  **Executar o Servidor:**
    Dentro da pasta principal do projeto, execute o comando:

    ```bash
    npx http-server
    ```

4.  **Acessar o Jogo:**
    Abra seu navegador e acesse o endereço fornecido no terminal (geralmente `http://localhost:8080`).


PS: O jogo foi feito de maneira simples e até de forma brincalhona, já que a intenção é apenas de aprendizado, eu acabei fazendo algumas coisas para dar risada, como o background e o nome do site
