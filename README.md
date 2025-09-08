# Desafio Front-end: SPA de Consulta de Pessoas (PJC-MT)

![Badge](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Badge](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Badge](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Contexto:** Projeto desenvolvido como avaliação técnica para a vaga de Desenvolvedor Júnior.

Esta é uma Single Page Application (SPA) que consome a API da Polícia Judiciária Civil de Mato Grosso para permitir a consulta de registros de pessoas desaparecidas e localizadas, com foco em uma interface moderna, responsiva e uma excelente experiência de usuário.

---

### 🖼️ Tela Principal

<p align="center">
<img width="1841" height="884" alt="image" src="https://github.com/user-attachments/assets/f70e298b-1373-422b-a198-ca04f0d0c3a5" />

</p>

---

### ✨ Funcionalidades e Diferenciais

- [x] **Busca Avançada:** Filtros por nome, faixa etária, sexo e status, consumindo todos os parâmetros suportados pela API.
- [x] **Paginação Inteligente:** Implementado um loop de busca resiliente que garante o número mínimo de registros por página, mesmo com inconsistências na API.
- [x] **Dossiê Digital Completo:** Página de detalhes com todas as informações relevantes da ocorrência, organizadas em seções expansíveis (accordion) para uma UI limpa.
- [x] **Envio de Múltiplos Anexos:** Formulário de submissão de informações com suporte a múltiplos uploads de imagem, com pré-visualização e opção de remoção.
- [x] **UX Polida e Moderna:**
    - **Notificações "Toast"** para feedback de sucesso e erro.
    - **Interface Otimista** que atualiza a tela instantaneamente após o envio de novas informações.
    - **Galeria de Imagens** em modal para visualização em alta resolução.
    - **Fundo Interativo** com partículas animadas (`tsparticles`) e efeito de radar.
    - **Transições de Página Suaves** e animações de interface com `Framer Motion`.
    - **Skeleton Loading** para melhoria da percepção de velocidade.
- [x] **Ambiente Dockerizado Completo:** Configuração para desenvolvimento (`Dockerfile.dev`) e produção (`Dockerfile` com Nginx).
- [x] **Testes Unitários e de Integração:** Suíte de testes com Vitest e React Testing Library para garantir a qualidade e o comportamento dos componentes.

---

### 🛠️ Tecnologias Utilizadas

* **Core:** React 19, TypeScript, Vite.
* **Estilização:** Tailwind CSS com um tema customizado (dark/neon).
* **Chamadas de API:** Axios.
* **Gerenciamento de Formulários:** React Hook Form com Zod.
* **Roteamento:** React Router DOM com `Lazy Loading`.
* **Animações:** Framer Motion & tsParticles.
* **Testes:** Vitest & React Testing Library.
* **Qualidade de Código:** ESLint e Prettier.

---

### 📝 Desafios e Decisões de Arquitetura

Para garantir a melhor experiência de usuário e a exatidão dos dados, foram implementadas estratégias de desenvolvimento defensivo para contornar inconsistências encontradas na API.

#### **1. Instabilidade e Inconsistências da API Externa:**

* **O Desafio:** 
    A API de teste apresentou `Erros 500` em endpoints críticos (`/login`, `/informacoes-desaparecido`) e inconsistências na lógica de filtragem e nos dados retornados.
* **A Solução Implementada:**
    Para contornar os bloqueios, foi implementado um **serviço de mock** de alta fidelidade para o desenvolvimento inicial. Após a estabilização parcial da API, o projeto foi conectado aos endpoints reais e **camadas de proteção no front-end** foram criadas (como a filtragem no lado do cliente) para garantir a integridade e a consistência dos dados exibidos ao usuário, mesmo com as falhas do back-end.(Para evitar erros, foi removido o arquivo)

#### **2. Lógica de Busca e Paginação Inteligente**

* **O Desafio:**
    O requisito era implementar uma paginação com no mínimo 10 registros por página. No entanto, foi identificado que o endpoint de filtro da API (`GET /v1/pessoas/aberto/filtro`) não respeitava consistentemente os parâmetros de `status` enviados, retornando listas que não correspondiam ao filtro ou que continham poucos registros. Uma filtragem simples no lado do cliente resultaria em páginas com um número inconstante de cards, violando o requisito.

* **A Solução Implementada:**
    Foi criada uma lógica de **"busca inteligente"** na `HomePage`. A aplicação entra em um loop `while` que busca páginas sequenciais da API em segundo plano, aplicando a lógica de filtro correta no lado do cliente. O loop continua até ter acumulado um número suficiente de registros (`>= 12`) que correspondam ao filtro do usuário, garantindo o cumprimento do requisito.

    * **📍 Evidência no Código:** `src/pages/Home/index.tsx` (na função `carregarDados`).

---

#### **3. Definição Consistente de Status (Desaparecido/Localizado)**

* **O Desafio:**
    Foi descoberto que a API possui "contratos" diferentes para a mesma entidade. O endpoint de lista (`/filtro`) e o de detalhes (`/{id}`) retornam objetos `Pessoa` com estruturas distintas. Notavelmente, o campo `status` não era enviado em todas as respostas, enquanto os campos `dataLocalizacao` e `encontradoVivo` estavam consistentemente disponíveis.

* **A Solução Implementada:**
    Para criar uma "fonte única da verdade", foi estabelecida uma **regra de negócio** no front-end. O status de uma pessoa é derivado de forma consistente em toda a aplicação (nos cards, na página de detalhes e na lógica de filtro) com base na seguinte lógica:

    ```typescript
    const status = pessoa.ultimaOcorrencia.dataLocalizacao || pessoa.ultimaOcorrencia.encontradoVivo 
      ? 'LOCALIZADO' 
      : 'DESAPARECIDO';
    ```
    * **📍 Evidência no Código:** `src/components/Card/index.tsx` e `src/pages/Detalhes/index.tsx`.
Evidência no Código: Esta lógica é aplicada de forma consistente nos arquivos src/components/Card/index.tsx (para os cards da lista) e src/pages/Detalhes/index.tsx (para a página de detalhes).

Esta abordagem garante que, independentemente das inconsistências nos dados da API, a interface sempre apresentará uma informação coesa e correta para o usuário final.
---
### 🚀 Como Executar o Projeto

**Pré-requisitos:** [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/install/).

#### **1. Modo de Produção (Recomendado para Avaliação)**
Este método constrói e executa a versão final e otimizada da aplicação.

```bash
# Clone o repositório
git clone https://github.com/freitaszLe/desenvolve-mt-abitus.git
cd desenvolve-mt-abitus

# Construa a imagem Docker de produção
docker build -t abitus .

# Execute o contêiner em segundo plano
docker run -d -p 80:80 abitus

# Mensagem de sucesso
echo "🚀 Aplicação em produção rodando em: http://localhost/"
```
Acesse **`http://localhost`** no seu navegador.

#### **2. Modo de Desenvolvimento**
Este método é ideal para desenvolvimento, pois reflete as alterações no código em tempo real.

```bash
# Após clonar e entrar no repositório
docker compose up --build
```
Acesse **`http://localhost:5173`** no seu navegador.

#### **3. Executando os Testes**
Para rodar a suíte de testes:

```bash
# Com o ambiente de desenvolvimento rodando, em um novo terminal:
docker compose exec dev sh

# Dentro do contêiner, execute:
npm test
```

---

### 💬 Contato

| **Leticia Arruda de Freitas** | |
| :--- | :--- |
| 📧 **Email** | `le.freitas712@gmail.com` |
| 📞 **Telefone** | `(65) 99226-6260` |
| 깃 **GitHub** | [@freitaszLe](https://github.com/freitaszLe) |
| 👔 **LinkedIn** | [Leticia Freitas](linkedin.com/in/leticia-freitas-9b7647382) |

<br />
