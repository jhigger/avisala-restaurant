# 0002: Monetary Decimal Types and Preserved Casing Postgres Enums

Established data modeling rules for PostgreSQL migration in Prisma schema.

Monetary and financial fields (`price`, `unitPrice`, `costPerUnit`, `subtotal`, `tax`, `deliveryFee`, `discount`, `totalAmount`) are typed as `@db.Decimal(10, 2)` to eliminate floating-point rounding errors while serializing seamlessly across tRPC via `superjson`. Raw pantry inventory quantities (`currentStock`, `quantityNeeded`) remain `Float` to support flexible fractional recipe measurements.

Domain categorical values (`Kingdom`, `Category`, `OrderType`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `Realm`, `TableStatus`, `ReservationStatus`, `StaffRole`, `DayOfWeek`) are modeled as native PostgreSQL enums while preserving their existing casing (e.g. `Appetizers`, `Mains`, `LIREO`) to maintain zero-regression compatibility with frontend components and display filters.
