export enum EShowTost {
  error = 'error',
  success = 'success',
  warning = 'warning',
}

export interface IShowToast {
  message: string;
  type: EShowTost;
}