import { Observable } from 'rxjs';
import { ValidatorFn } from '@angular/forms';

export type TargetSetupViewModel = {
  Id: string;
  IndicatorId: string;
  Year: number;
  CreatedDate: string;

  TargetDateRange: {
    StartDate: string;
    EndDate: string;
  };

  TimePeriodFrequency: {
    Value: number;
    DisplayName: string;
  };

  TimePeriod: {
    Value: number;
    DisplayName: string;
  };

  TargetUnit: {
    Number: number;
    Percentage: number;
  };

  TargetDisaggregation: {
    TargetBoysNumber: number;
    TargetGirlsNumber: number;
    TargetTransgenderNumber: number;
    TargetPWDBoysNumber: number;
    TargetPWDGirlsNumber: number;
    TargetPWDTransgenderNumber: number;
  };

  TargetSource: string;
  CalculationMethodology: string;
};

export type TargetSetupCommandPayload = {
  // CorrelationId: string;
  Id?: string;
  IndicatorTargetId?: string;
  IndicatorId: string; // GUID
  Year: number;
  TimeFrequencyId: number;
  TimePeriodId: number;
  TargetNumber: number;
  TargetPercentage: number;
  TargetBoysNumber: number;
  TargetGirlsNumber: number;
  TargetTransgenderNumber: number;
  TargetPWDBoysNumber: number;
  TargetPWDGirlsNumber: number;
  TargetPWDTransgenderNumber: number;
  Source: string;
  CalculationMethodology: string;
};

export interface DeleteTargetSetupCommandPayload {
  CorrelationId: string;
  IndicatorId: string;
  IndicatorTargetId: string;
}

export type IndicatorStatementOptions = {
  Value: number;
  DisplayName: string;
};

export type TimePeriodOptions = {
  Value: number;
  DisplayName: string;
};

export type FrequencyOptions = {
  Value: number;
  DisplayName: string;
};

export type StatusOptions = {
  Value: number;
  DisplayName: string;
};

// Form control types
export type FormControlType = {
  value: number | null;
  disabled?: boolean;
  valueChanges: Observable<number | null>;
  reset(): void;
  setValue(value: number | null): void;
  setValidators(validators: ValidatorFn[]): void;
  clearValidators(): void;
  updateValueAndValidity(): void;
};

// Time period option type
export type TimePeriodOption = {
  value: number;
  label: string;
  disabled?: boolean;
};

// Frequency option type
export type FrequencyOption = {
  value: number;
  label: string;
  timePeriod: TimePeriodOption[];
};

// Available time periods array type
export type AvailableTimePeriod = TimePeriodOption[];
