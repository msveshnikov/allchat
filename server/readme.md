```mermaid
graph TD
A[AllChat API] --> B[Express Server]
B --> C[Routes]
B --> D[Middleware]
B --> E[Database]
B --> F[External Services]

    C --> C1[User Management]
    C --> C2[Chat Interactions]
    C --> C3[Tool Calls]
    C --> C4[Subscriptions]

    D --> D1[CORS]
    D --> D2[Rate Limiting]
    D --> D3[Authentication]
    D --> D4[Logging]

    E --> E1[MongoDB]

    F --> F1[AI Models]
    F --> F2[Email Service]
    F --> F3[Telegram Bot]
    F --> F4[Payment Gateway]
    F --> F5[Web Scraping]
    F --> F6[File Processing]

    F1 --> F1A[Anthropic AI]
    F1 --> F1B[Google Vertex AI]
    F1 --> F1C[OpenAI]

    F6 --> F6A[PDF Parsing]
    F6 --> F6B[Word Document Processing]
    F6 --> F6C[Excel Spreadsheet Handling]

    B --> G[WebSocket Server]

    H[Utilities] --> H1[Sitemap Generation]
    H --> H2[Cron Jobs]
    H --> H3[Image Processing]
