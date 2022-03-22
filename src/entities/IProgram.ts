export interface IProgram {
  name: string;
  specialityGroup: number;
  yearPlans: Array<{
    specialityHalfHours: number;
    commonSubjectsHalfHours: Record<number, number>;
  }>;
}
