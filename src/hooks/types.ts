/**
 * TypeScript Type Definitions for Custom Hooks
 * 
 * This file contains TypeScript interfaces and types for all custom hooks
 * in the React Hooks Complete collection.
 */

import { RefObject } from 'react';

// ==================== STATE MANAGEMENT TYPES ====================

export interface UseToggleReturn {
  0: boolean;
  1: {
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
  };
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

export interface UseArrayReturn<T> {
  array: T[];
  set: (array: T[]) => void;
  push: (element: T) => void;
  filter: (callback: (item: T, index: number) => boolean) => void;
  update: (index: number, newElement: T) => void;
  remove: (index: number) => void;
  clear: () => void;
  reset: () => void;
}

// ==================== STORAGE TYPES ====================

export type UseStorageReturn<T> = [T, (value: T | ((prev: T) => T)) => void];

// ==================== ASYNC TYPES ====================

export interface UseAsyncReturn<T, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ==================== TIMING TYPES ====================

export type UseDebounceReturn<T> = T;
export type UseThrottleReturn<T> = T;

// ==================== DOM/EVENT TYPES ====================

export interface UseKeyPressOptions {
  event?: 'keydown' | 'keyup' | 'both';
  target?: EventTarget;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export interface UseWindowSizeReturn {
  width: number;
  height: number;
}

export interface UseScrollPositionReturn {
  x: number;
  y: number;
}

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export interface UseIntersectionObserverReturn {
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
}

export interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onMessage?: (message: any) => void;
  onError?: (event: Event) => void;
  shouldReconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export interface UseWebSocketReturn {
  socket: WebSocket | null;
  lastMessage: any;
  messageHistory: any[];
  readyState: number;
  sendMessage: (message: any) => void;
  disconnect: () => void;
  reconnectCount: number;
}

// ==================== UTILITY TYPES ====================

export interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  paste: () => Promise<string>;
  copiedText: string | null;
  isCopied: boolean;
}

// ==================== FORM TYPES ====================

export interface ValidationRule<T = any> {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  message?: string;
  custom?: (value: any, allValues: T) => string | undefined;
}

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T> | ((value: T[K], allValues: T) => string);
};

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: <K extends keyof T>(name: K, value: T[K]) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e: React.FormEvent) => void;
  reset: () => void;
  validateAll: () => boolean;
}

// ==================== HOOK FUNCTION SIGNATURES ====================

// State Management Hooks
export declare function useToggle(initialValue?: boolean): UseToggleReturn;
export declare function useCounter(initialValue?: number, step?: number): UseCounterReturn;
export declare function useArray<T>(initialValue?: T[]): UseArrayReturn<T>;

// Storage Hooks
export declare function useLocalStorage<T>(key: string, initialValue: T): UseStorageReturn<T>;
export declare function useSessionStorage<T>(key: string, initialValue: T): UseStorageReturn<T>;

// Async Hooks
export declare function useAsync<T, E = Error>(
  asyncFunction: (...args: any[]) => Promise<T>,
  dependencies?: React.DependencyList
): UseAsyncReturn<T, E>;

export declare function useFetch<T = any>(
  url: string,
  options?: RequestInit
): UseFetchReturn<T>;

// Timing Hooks
export declare function useDebounce<T>(value: T, delay: number): UseDebounceReturn<T>;
export declare function useThrottle<T>(value: T, delay: number): UseThrottleReturn<T>;
export declare function useInterval(callback: () => void, delay: number | null): void;
export declare function useTimeout(callback: () => void, delay: number): void;

// DOM/Event Hooks
export declare function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: Event) => void
): void;

export declare function useKeyPress(
  targetKey: string,
  options?: UseKeyPressOptions
): boolean;

export declare function useWindowSize(): UseWindowSizeReturn;
export declare function useScrollPosition(): UseScrollPositionReturn;
export declare function useMediaQuery(query: string): boolean;

export declare function useIntersectionObserver(
  elementRef: RefObject<HTMLElement>,
  options?: UseIntersectionObserverOptions
): UseIntersectionObserverReturn;

export declare function useWebSocket(
  url: string,
  options?: UseWebSocketOptions
): UseWebSocketReturn;

// Utility Hooks
export declare function usePrevious<T>(value: T): T | undefined;
export declare function useMount(callback: () => void): void;
export declare function useUnmount(callback: () => void): void;
export declare function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void;

export declare function useClipboard(): UseClipboardReturn;

// Form Hooks
export declare function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T>;

// ==================== EXAMPLE USAGE TYPES ====================

// Example interfaces for common use cases
export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
  subscribe?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

// ==================== UTILITY TYPES ====================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncState<T, E = Error> = {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<E>;
};

export type EventHandler<T = Event> = (event: T) => void;
export type AsyncFunction<T = any, Args extends any[] = any[]> = (...args: Args) => Promise<T>;

// Generic hook return type for hooks that return a tuple
export type HookReturnTuple<T, U> = [T, U];

// Generic hook return type for hooks that return an object
export type HookReturnObject<T> = T;

// Helper type for extracting hook return types
export type HookReturn<T> = T extends (...args: any[]) => infer R ? R : never;

// ==================== ADVANCED TYPES ====================

// Type for creating strongly-typed validation schemas
export type StrictValidationSchema<T> = {
  [K in keyof T]: ValidationRule<T> | ((value: T[K], allValues: T) => string | undefined);
};

// Type for form field configuration
export interface FieldConfig<T> {
  name: keyof T;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
  validation?: ValidationRule<T>;
}

// Type for dynamic form configuration
export type FormConfig<T> = {
  fields: FieldConfig<T>[];
  onSubmit: (values: T) => void | Promise<void>;
  initialValues?: Partial<T>;
};

// Type for hook composition
export type ComposedHook<T extends any[]> = (...args: T) => any;

// Type for hook factory functions
export type HookFactory<TOptions, TReturn> = (options: TOptions) => () => TReturn;

// Export all types as a namespace
export namespace HookTypes {
  export type ToggleReturn = UseToggleReturn;
  export type CounterReturn = UseCounterReturn;
  export type ArrayReturn<T> = UseArrayReturn<T>;
  export type StorageReturn<T> = UseStorageReturn<T>;
  export type AsyncReturn<T, E = Error> = UseAsyncReturn<T, E>;
  export type FetchReturn<T> = UseFetchReturn<T>;
  export type KeyPressOptions = UseKeyPressOptions;
  export type WindowSizeReturn = UseWindowSizeReturn;
  export type ScrollPositionReturn = UseScrollPositionReturn;
  export type IntersectionObserverOptions = UseIntersectionObserverOptions;
  export type IntersectionObserverReturn = UseIntersectionObserverReturn;
  export type WebSocketOptions = UseWebSocketOptions;
  export type WebSocketReturn = UseWebSocketReturn;
  export type ClipboardReturn = UseClipboardReturn;
  export type FormOptions<T> = UseFormOptions<T>;
  export type FormReturn<T> = UseFormReturn<T>;
}
