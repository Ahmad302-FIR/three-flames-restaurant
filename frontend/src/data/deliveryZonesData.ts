import { DeliveryZone } from '../types';

export const initialDeliveryZones: DeliveryZone[] = [
  {
    id: 'zone-1',
    name: 'University Town & Abdara Road',
    fee: 100,
    minOrder: 800,
    estimatedMinutes: '20-30 mins',
    active: true
  },
  {
    id: 'zone-2',
    name: 'Hayatabad (Phases 1-7)',
    fee: 200,
    minOrder: 1200,
    estimatedMinutes: '35-45 mins',
    active: true
  },
  {
    id: 'zone-3',
    name: 'Peshawar Cantt & Saddar',
    fee: 200,
    minOrder: 1000,
    estimatedMinutes: '30-40 mins',
    active: true
  },
  {
    id: 'zone-4',
    name: 'Danishabad & Rahatabad',
    fee: 150,
    minOrder: 800,
    estimatedMinutes: '25-35 mins',
    active: true
  },
  {
    id: 'zone-5',
    name: 'Ring Road & Gulbahar',
    fee: 250,
    minOrder: 1500,
    estimatedMinutes: '40-50 mins',
    active: true
  },
  {
    id: 'zone-6',
    name: 'Warsak Road & Defense Colony',
    fee: 250,
    minOrder: 1500,
    estimatedMinutes: '40-55 mins',
    active: true
  },
  {
    id: 'zone-7',
    name: 'City / Namak Mandi & Hashtnagri',
    fee: 300,
    minOrder: 2000,
    estimatedMinutes: '45-60 mins',
    active: true
  },
  {
    id: 'zone-8',
    name: 'Regi Model Town & DHA Peshawar',
    fee: 350,
    minOrder: 2500,
    estimatedMinutes: '50-65 mins',
    active: true
  }
];
