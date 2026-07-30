// Codebase Digital Twin — Neo4j seed data
// Run with: cat init.cypher | cypher-shell -u neo4j -p digitaltwin
// (or `:play file:///init.cypher` won't work in browser; use cypher-shell,
// or the "Import" tab, or docker exec into dt-neo4j and run cypher-shell)

CREATE (frontend:Service {id: 'frontend', name: 'Frontend', owner: 'Platform Team', criticality: 'MEDIUM'})
CREATE (gateway:Service {id: 'api-gateway', name: 'API Gateway', owner: 'Platform Team', criticality: 'HIGH'})
CREATE (auth:Service {id: 'auth-service', name: 'Auth Service', owner: 'Kunal', criticality: 'HIGH'})
CREATE (user:Service {id: 'user-service', name: 'User Service', owner: 'Amit', criticality: 'MEDIUM'})
CREATE (order:Service {id: 'order-service', name: 'Order Service', owner: 'Rahul', criticality: 'HIGH'})
CREATE (payment:Service {id: 'payment-service', name: 'Payment Service', owner: 'Kunal', criticality: 'CRITICAL'})
CREATE (notif:Service {id: 'notification-service', name: 'Notification Service', owner: 'Amit', criticality: 'LOW'})

CREATE (redis:Database {id: 'redis-session', name: 'Redis Session Store'})
CREATE (ordersDb:Database {id: 'postgres-orders', name: 'Orders DB'})
CREATE (paymentsDb:Database {id: 'payments-db', name: 'Payments DB'})

CREATE (frontend)-[:CALLS]->(gateway)
CREATE (gateway)-[:CALLS]->(auth)
CREATE (gateway)-[:CALLS]->(user)
CREATE (gateway)-[:CALLS]->(order)
CREATE (auth)-[:USES]->(redis)
CREATE (auth)-[:DEPENDS_ON]->(user)
CREATE (order)-[:DEPENDS_ON]->(payment)
CREATE (order)-[:USES]->(ordersDb)
CREATE (payment)-[:USES]->(paymentsDb)
CREATE (payment)-[:CALLS]->(notif)
CREATE (order)-[:CALLS]->(notif);
