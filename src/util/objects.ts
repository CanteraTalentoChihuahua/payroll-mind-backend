import { DecimalDataType } from "sequelize/types";

export const Privileges = {
    CREATE_ADMINS: { id: 1, description: "Crear administradores" },
    READ_ADMINS: { id: 2, description: "Ver todos los administradores" },
    EDIT_ADMINS: { id: 3, description: "Editar administradores" },
    DELETE_ADMINS: { id: 4, description: "Borrar administradores" },
    REACTIVATE_ADMINS: { id: 5, description: "Reactivar administradores inactivos" },

    CREATE_COLLABORATORS: { id: 6, description: "Crear colaboradores" },
    READ_COLLABORATORS: { id: 7, description: "Ver todos los colaboradores" },
    EDIT_COLLABORATORS: { id: 8, description: "Editar colaboradores" },
    DELETE_COLLABORATORS: { id: 9, description: "Borrar colaboradores" },
    REACTIVATE_COLLABORATORS: { id: 10, description: "Reactivar colaboradores inactivos" },

    CREATE_BUSINESS_UNITS: { id: 11, description: "Crear unidades de negocio" },
    READ_BUSINESS_UNITS: { id: 12, description: "Leer las unidades de negocio" },
    EDIT_BUSINESS_UNITS: { id: 13, description: "Editar las unidades de negocio" },
    DELETE_BUSINESS_UNITS: { id: 14, description: "Remover las unidades de negocio" },
    REACTIVATE_BUSINESS_UNITS: { id: 15, description: "Reactivar unidades de negocio inactivas" },

    CREATE_BONUSES: { id: 16, description: "Crear bonos" },
    READ_BONUSES: { id: 17, description: "Ver todos los bonos existentes" },
    EDIT_BONUSES: { id: 18, description: "Editar bonos" },
    DELETE_BONUSES: { id: 19, description: "Borrar bonos" },
    ASSIGN_BONUSES: { id: 20, description: "Asignar bonos" },

    GIVE_PRIVILEGES: { id: 21, description: "Asignar privilegios" },
    REMOVE_PRIVILEGES: { id: 22, description: "Remover privilegios" },

    CREATE_PAYROLL_RECEIPTS: { id: 23, description: "Generar recibos de nómina" },
    EDIT_PAYROLL: { id: 24, description: "Editar datos de nómina" },

    CREATE_REPORTS: { id: 25, description: "Crear reportes" },
    READ_REPORTS: { id: 26, description: "Ver reportes" },

    READ_USERS: { id: 27, description: "Leer los usuarios del sistema " }            // Specify business unit?
};

export type Privilege = { id: number, description: string }

export type NewUserData = {
    first_name: string,
    last_name: string,
    birthday: string,
    email: string,
    phone_number: string,
    role_id: number,
    privileges: Array<number> | undefined,
    payment_period_id: number,
    on_leave: boolean | undefined,
    active: boolean | undefined,
    salary_id: number,
    business_unit_id: Array<number>,
    bank: string,
    CLABE: string,
    payroll_schema_id: number,
    second_name: string | undefined,
    second_last_name: string | undefined
}

export type newIncomeData = {
    income_id: number,
    counter: number,
    amount: DecimalDataType,
    automatic: boolean
}

export type newOutcomeData = {
    outcome_id: number,
    counter: number,
    amount: DecimalDataType,
    automatic: boolean
}
