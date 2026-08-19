// src/demos/taxai-wizard/screens/StepCard.tsx
//
// Re-export shim for the Card primitive (extracted to _shared/Card.tsx in E.1).
// Kept here so all wizard screens continue to import StepCard/StepCardHeader/
// StepCardTitle/StepCardDescription/StepCardContent unchanged.

export {
  Card as StepCard,
  CardHeader as StepCardHeader,
  CardTitle as StepCardTitle,
  CardDescription as StepCardDescription,
  CardContent as StepCardContent,
} from "@/demos/_shared/Card";