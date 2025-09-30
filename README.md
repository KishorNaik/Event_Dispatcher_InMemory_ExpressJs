# 🧠 In-Memory Event Dispatcher

## 📘 Overview
The In-Memory Event Dispatcher is a lightweight, decoupled messaging system designed for in-process communication. Built atop Node.js’s native EventEmitter, it enables structured messaging patterns within a single application instance—allowing components to interact without direct dependencies.
This promotes a modular, maintainable architecture where producers and consumers can evolve independently.

## 🔁 Supported Messaging Patterns
### 📣 Sender and Receiver (Pub/Sub)
Implements one-way, fire-and-forget messaging.
- `Producer`: Sends messages to a topic using `SendReceiverProducerEventDispatcher`.
- `Consumer`: Subscribes to topics using `SendReceiverConsumerEventDispatcher`.
Use cases include logging, notifications, telemetry, and event-driven workflows.

### 🔄 Request and Reply
Implements two-way, command-style communication.
- `Producer`: Sends requests and awaits replies via `RequestReplyProducerEventDispatcher`.
- `Consumer`: Listens for requests, processes them, and replies using `RequestReplyConsumerEventDispatcher`.
Each request is tagged with a correlationId to match responses. Producers can configure timeouts to avoid indefinite waits.
Use cases include querying state, triggering actions, or requesting data transformations.

## 🧩 Roles in the System
### 🟦 Producer
Initiates communication by sending messages or requests.
- SendReceiverProducerEventDispatcher: For one-way messages.
- RequestReplyProducerEventDispatcher: For request-response interactions.

### 🟩 Consumer
Listens for and processes incoming messages or requests.
- SendReceiverConsumerEventDispatcher: For fire-and-forget subscriptions.
- RequestReplyConsumerEventDispatcher: For handling requests and sending replies.
Use EventDispatcherRunner to orchestrate multiple consumers—ensuring all listeners are active and responsive.

## 🚀 Installation
### 🐳 Install Docker Desktop
- Download and install Docker: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 💾 Setup Redis Using Docker

```bash
docker pull redis
docker run --name my-redis -d -p 6379:6379 redis
```

#### 📦 Project Setup
- Clone the Repository
```bash
git clone https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs
cd <your-project-directory>
```
- 🌐 Setup `api` Service
    - Move into the api solution and create an .env file:
    ```bash
        # PORT
        NODE_ENV="development"
        PORT = 3000

        # LOG
        LOG_FORMAT = dev
        LOG_DIR = logs

        # CORS
        ORIGIN = *
        CREDENTIALS = true

        # Redis
        REDIS_HOST = 127.0.0.1
        #Local Docker
        #DB_HOST=host.docker.internal
        #REDIS_USERNAME = username
        #REDIS_PASSWORD = password
        REDIS_DB = 0
        REDIS_PORT = 6379

        #Rate Limit and Throttle
        GLOBAL_WINDOW_MINUTES=15
        RATE_LIMITER=150
        SLOW_DOWN_DELAY_AFTER_HITS =75
        SLOW_DOWN_INITIAL_DELAY_MS=300
        SLOW_DOWN_MAX_DELAY_MS=3000
    ```
    - Install dependencies:
    ```bash
    npm i
    ```
    - Build the Api service:
    ```bash
    npm run build
    ```
    - Run the API in development mode:
    ```bash
    npm run dev
    OR
    npm run dev:api
    ```
## 🚀 Source Code
- Send and Receiver
  - Producer
    - Contract
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/apps/features/v1/sendReceiver/contract/index.ts
    - Service
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/apps/features/v1/sendReceiver/service/index.ts
    - Endpoint
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/apps/features/v1/sendReceiver/endpoint/index.ts
    - Test
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/tests/integrations/features/v1/sendReceiver/index.test.ts
  - Consumer
    - Contract
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/apps/features/v1/sendReceiver/contract/index.ts
    - Event
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/apps/features/v1/sendReceiver/event/index.ts
    - SendReceiver Index File
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/apps/features/v1/sendReceiver/index.ts
    - Register Consumers in consumer.Module.ts
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/consumer.Module.ts
- Request and Reply
  - Producer
    - Contract
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/apps/features/v1/requestReply/contract/index.ts
    - Service
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/apps/features/v1/requestReply/service/index.ts
    - Endpoint
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/apps/features/v1/requestReply/endpoint/index.ts
    - Test
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/producer/tests/integrations/features/v1/requestReply/index.test.ts
  - Consumer
    - Contract
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/apps/features/v1/requestReply/contract/index.ts
    - Event
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/apps/features/v1/requestReply/event/index.ts
    - RequestReply Index File
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/apps/features/v1/requestReply/index.ts
    - Register Consumers in consumer.Module.ts
      https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/modules/consumers/consumer.Module.ts
 - Register Event Dispatcher on server.ts file
  https://github.com/KishorNaik/Event_Dispatcher_InMemory_ExpressJs/blob/main/src/server.ts#L23
