import { Income } from "./income.model";

export interface UserModel {
    uid?: string;
    displayName?: string;
    name?: string;
    photoURL?: string;
    email?: string;
    password?: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
    incomes?: Income[];
    onboardingStep?: number;
}