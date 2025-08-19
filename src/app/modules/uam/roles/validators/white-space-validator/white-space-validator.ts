import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: 'Value is only whitespace' };
  };
}

export function noSpecialCharacterValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value || '';
    // const isValid = /^[a-zA-Z_]*$/.test(value);
    const isValid = /^[a-zA-Z_]*$/.test(value) && /[a-zA-Z]/.test(value);
    return isValid
      ? null
      : { invalidCharacter: 'Only letters and underscores are allowed' };
  };
}
