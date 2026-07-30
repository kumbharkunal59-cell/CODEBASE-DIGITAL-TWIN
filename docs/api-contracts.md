# API Contracts

Base URL: `http://localhost:8080/api`

## GET /graph

```json
{
  "nodes": [
    { "id": "payment-service", "label": "Payment Service", "type": "service", "owner": "Kunal", "criticality": "CRITICAL" }
  ],
  "edges": [
    { "id": "e7", "source": "order-service", "target": "payment-service", "relationship": "DEPENDS_ON" }
  ]
}
```

## GET /risk/{serviceId}

```json
{
  "serviceId": "payment-service",
  "criticalityScore": 95,
  "busFactorScore": 40,
  "coverageScore": 59,
  "changeFailureScore": 30,
  "overallScore": 68,
  "computedAt": "2026-07-30T12:00:00Z"
}
```

## GET /simulate/{serviceId}

```json
{
  "targetServiceId": "payment-service",
  "affectedServiceIds": ["order-service", "api-gateway", "frontend"],
  "affectedApiCount": 9,
  "criticality": "CRITICAL",
  "revenueImpact": "SEVERE",
  "cascadePath": ["payment-service", "order-service", "api-gateway", "frontend"]
}
```

## GET /ownership/{serviceId}

```json
{
  "serviceId": "payment-service",
  "owner": "Kunal",
  "contributors": ["Amit", "Rahul"],
  "changeFrequencyLast90Days": 34,
  "busFactor": 3
}
```

## POST /assistant/ask

Request:
```json
{ "question": "What happens if payment-service fails?" }
```

Response:
```json
{
  "answer": "...",
  "relevantSubgraph": { "nodes": [...], "edges": [...] }
}
```
