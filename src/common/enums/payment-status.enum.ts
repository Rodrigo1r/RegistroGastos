export enum PaymentStatus {
  UPCOMING = 'upcoming', // Próximo a pagar (verde - más de 6 días)
  NEAR_DUE = 'near_due', // Próximo a pagar (naranja - 5 días o menos)
  OVERDUE = 'overdue', // Atrasado (rojo - fecha vencida)
  PARTIAL = 'partial', // Pago parcial
  COMPLETED = 'completed', // Completado
}
