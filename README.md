# Projeto Legacy - E-commerce Monolítico 

Este projeto simula um backend de e-commerce com código "legado". Ele funciona, mas possui graves problemas de design que dificultam a manutenção e expansão.

## Estrutura de Diretórios

* `src/controllers/OrderController.ts`: **O Problema.** Contém toda a lógica de negócio centralizada (validação, frete, pagamento, banco, notificação).
* `src/lib/logger.ts`: Utilitário de log (Winston - procure mais sobre ele, é muito util em projetos reais).
* `src/lib/mail.ts`: Configuração do Nodemailer (utilizando Ethereal para testes).
* `src/app.ts` & `src/server.ts`: Configuração do Express e inicialização do servidor.
* `prisma/`: Configuração do banco de dados SQLite e script de seed.
* `prisma/seed.ts`: Popula o banco com dados iniciais.

## Instalação e Configuração

Siga os passos abaixo para preparar o ambiente:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Crie o banco de dados (SQLite) e as tabelas:**
    ```bash
    npm run prisma:migrate
    ```

3.  **Popule o banco com dados de teste (Livro Físico e E-book):**
    ```bash
    npm run prisma:seed
    ```

## Execução

Para rodar a API em modo de desenvolvimento (reinicia ao salvar arquivos):

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.
*Nota: A primeira execução pode demorar alguns segundos para gerar as credenciais de teste do Ethereal Mail.*

## Como Testar

Utilize o **cURL** (terminal) ou ferramentas como **Postman/Insomnia** para enviar requisições POST.

Você pode utilizar o gitbash para executar os comandos abaixo usando o cURL, ele parece estar funcionando muito bem (mas claro que o melhor seria utilizar Linux).


### Cenário 1: Compra de Livro Físico (Com Frete)
O sistema deve calcular R$ 10,00 de frete.

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacaxi123@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

### Cenário 2: Compra de E-book (Digital)
Produto digital (ID 2). Observe como o código atual trata isso (gera frete incorreto ou lógica misturada).

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacate123@ethereal.email",
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

---

# Princípios SOLID Aplicados no Projeto

Este texto demonstra a aplicação dos princípios **SOLID** em um sistema de pedidos, com uma arquitetura organizada, modular e testável.


## 1. SRP (Single Responsibility Principle) - Responsabilidade Única

**Antes:**  
O `OrderController` era um "faz-tudo": recebia a requisição, calculava frete, lidava com banco de dados, processava pagamento e enviava e-mail.

**Depois:**  
Fragmentamos as responsabilidades em camadas especializadas:

- **Controller:** Apenas recebe a requisição HTTP e envia a resposta.  
- **OrderService:** Orquestra o fluxo de negócio (o "cérebro" da operação).  
- **NotificationService:** Cuida apenas da lógica de notificação (assunto, corpo do e-mail).  
- **Repository:** Cuida apenas de salvar/buscar dados.  
- **Provider:** Cuida apenas da integração técnica (ex: conectar no servidor de e-mail).


## 2. OCP (Open/Closed Principle) - Aberto para Extensão, Fechado para Modificação

**Problema antigo:**  
Para adicionar um método de pagamento como "Pix", era necessário alterar o Controller/Service adicionando condicionais.

**Solução:**  
Criamos a interface `IPaymentMethod`:

- Cada método de pagamento (`CreditCardPayment`, `PixPayment`, `DebitCardPayment`) é uma classe isolada.  
- Para adicionar um novo método (ex: "Boleto"), basta criar uma nova classe.  
- O `OrderService` não muda; ele apenas chama o método `.process()` do pagamento recebido.


## 3. LSP (Liskov Substitution Principle) - Substituição de Liskov

**Problema antigo:**  
O código verificava `if (product.type === 'physical')` para cobrar frete, obrigando o sistema a conhecer detalhes de cada tipo de produto.

**Solução:**  
Criamos a classe base `Product` com o método `calculateFreight()`:

- **PhysicalProduct:** Implementa o cálculo real.  
- **DigitalProduct:** Retorna zero.  

**Resultado:**  
O `OrderService` trata todos como `Product` sem perguntar o tipo; cada produto calcula seu próprio frete. Substituições funcionam sem quebrar a lógica.


## 4. DIP (Dependency Inversion Principle) - Inversão de Dependência

**Antes:**  
O código dependia diretamente do `PrismaClient` ou `nodemailer`.

**Depois:**  
O `OrderService` agora depende de interfaces (`IOrderRepository`, `IMailProvider`):

- O serviço não sabe se o banco é Prisma ou se o e-mail é Ethereal.  
- Permite trocar banco de dados ou serviço de e-mail (ex: AWS SES) sem alterar a regra de negócio.


## Pulo do Gato: ProductFactory

Para interligar tudo:

1. A factory verifica o campo `type` nos dados vindos do banco.  
2. Instancia a classe correta (`PhysicalProduct` ou `DigitalProduct`).  
3. Retorna um objeto rico com métodos, não apenas dados.

