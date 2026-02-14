export interface Product {
  id: string;
  name: string;
  what: string;
  why: string;
  cta: string;
  classId: string;
}

export interface ProductClass {
  id: string;
  label: string;
  name: string;
  shortName: string;
  color: string;
}

export const PRODUCT_CLASSES: ProductClass[] = [
  { id: 'class-01', label: 'Class 01', name: 'Delivery Services', shortName: 'DBP', color: 'indigo' },
  { id: 'class-02', label: 'Class 02', name: 'Delivery Products', shortName: 'DT2.0', color: 'blue' },
  { id: 'class-03', label: 'Class 03', name: 'Insight Products', shortName: 'DCO', color: 'teal' },
  { id: 'class-04', label: 'Class 04', name: 'Transaction Platforms', shortName: 'TxM', color: 'violet' },
];

export const PRODUCTS: Product[] = [
  { id: 'plant-4.0', name: 'Plant 4.0', what: 'Industrial operations platform for connected, data-driven plants.', why: 'Unifies performance, energy, automation, and OT security into one execution workspace.', cta: 'Open Plant 4.0', classId: 'class-01' },
  { id: 'dtmp', name: 'DTMP', what: 'Data-driven platform to manage and steer transformation programmes.', why: 'Centralises portfolio, analytics, governance, and delivery in one execution view.', cta: 'Open DTMP', classId: 'class-02' },
  { id: 'tmaas', name: 'TMaaS', what: 'Self-service marketplace of reusable transformation initiatives and accelerators.', why: 'Launches delivery faster with standardised blueprints and consistent execution patterns.', cta: 'Open TMaaS', classId: 'class-02' },
  { id: 'dto4t', name: 'DTO4T', what: 'AI-driven transformation clinic that diagnoses maturity and prescribes next steps.', why: 'Reduces cost and failure by making transformation repeatable and data-led.', cta: 'Open DTO4T', classId: 'class-02' },
  { id: 'dtmi', name: 'DTMI | DQ Web', what: 'Insight publishing platform for transformation knowledge and perspectives.', why: 'Turns scattered content into structured intelligence for better decisions.', cta: 'Open DTMI', classId: 'class-03' },
  { id: 'dtma', name: 'DTMA', what: 'Academy delivering practice-based learning for transformation roles.', why: 'Builds capability without slowing execution—learning stays close to real work.', cta: 'Open DTMA', classId: 'class-03' },
  { id: 'dtmb', name: 'DTMB (6xD)', what: 'Book playbooks that codify Agile 6xD execution.', why: 'Keeps teams aligned on the same delivery discipline, language, and patterns.', cta: 'Open DTMB (6xD)', classId: 'class-03' },
  { id: 'dtmc', name: 'DTMC (GHC)', what: 'Book playbooks that codify the GHC competency system.', why: 'Protects alignment across culture, governance, and execution as complexity grows.', cta: 'Open DTMC (GHC)', classId: 'class-03' },
  { id: 'txm-b2b2c', name: 'TxM (B2B2C)', what: 'Transaction platform for consumer and experience ecosystems.', why: 'Makes execution scalable across high-volume journeys and service interactions.', cta: 'Open TxM (B2B2C)', classId: 'class-04' },
  { id: 'txm-b2b2b', name: 'TxM (B2B2B)', what: 'Transaction platform for transformation and enterprise ecosystems.', why: 'Standardises handoffs and execution across partners, teams, and enterprise workflows.', cta: 'Open TxM (B2B2B)', classId: 'class-04' },
];
