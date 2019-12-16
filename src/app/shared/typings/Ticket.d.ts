import { Modules } from "@shared/utils/modules.enum";
/**
 * Posibles estados
 */
export type StatusOption = 'todo' | 'doing' | 'waiting' | 'done';

/**
 * Posibles subestados, separados por los estados principales
 */
type SubStatusTodo = 'Pte. Planificar' | 'Planificada';
type SubStatusDoing = 'En tiempo' | 'Atrasada';
type SubStatusPaused = 'Pausada' | 'Pte. Revisión';
type SubStatusDone = 'Realizada' | 'Cancelada';


interface SelectI {
  label: string;
  value: string | number;
}
export interface SubStatus extends SelectI {
  color: string;
}

/**
 * Estructura general del estado
 */
export interface Status {
  main: SelectI,
  secondary: SubStatus,
}
export interface PriorityI {
  order: number;
}

/**
 * Tipo de dato basico para selects
 */
export interface BasicInfo {
  id: number;
  label: string;
}

/**
 * Proyecto "padre"
 */
export interface ParentInfo extends BasicInfo {
  id: number;
  label: string;
  mod: Modules;
  responsible: BasicInfo;
}
