export interface Maskings {
  MaskingId: string;
  MaskingName: string;
}

export interface ProgramName {
  Data: Program[];
}
export interface Program {
  [x: string]: any;
  ItemKey: number;
  ItemValue: string;
  MaskingList?: Maskings[];
}
