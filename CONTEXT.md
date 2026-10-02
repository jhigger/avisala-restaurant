# Avisala Restaurant Context

Culinary management system inspired by the mythos of Encantadia, orchestrating kingdom-themed dining, pantry inventory, reservations, and orders.

## Language

**Kingdom**:
One of the four foundational elemental realms (`LIREO`, `SAPIRO`, `HATHORIA`, `ADAMYA`) representing the culinary heritage of menu items and staff affinity.
_Avoid_: Nation, faction, element

**Realm**:
A dedicated themed dining section within the restaurant (`LIREO_TERRACE`, `HATHORIAN_HEARTH`, `SAPIRO_HALL`, `ADAMYA_LAGOON`).
_Avoid_: Zone, section, dining room

**Brilyante Spice Level**:
Elemental spice grading scale from 0 (mild) to 4 (maximum elemental heat) attributed to dishes.
_Avoid_: Heat index, spicy rating

**MenuItem**:
A prepared dish or potion offered on the restaurant menu, categorized by kingdom affinity and course.
_Avoid_: Dish, food item, product

**Ingredient**:
A raw pantry supply tracked by unit (kg, L, g, units) with stock thresholds and unit costs.
_Avoid_: Supply, stock item, raw material

**Order**:
A customer request for prepared dishes via delivery or pickup, tracked through lifecycle statuses (`PENDING`, `PREPARING`, `READY`, `FULFILLED`, `CANCELLED`).
_Avoid_: Purchase, transaction

**Reservation**:
A scheduled table booking in a specific Realm for a designated party size and time slot.
_Avoid_: Booking, appointment
