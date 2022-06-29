export const Privileges = {
    CREATE_ADMIN: { id: 1, description: "Crear administradores" },
    CREATE_BUSINESS_UNITS: { id: 2, description: "Crear unidades de negocio" },
    EDIT_BUSINESS_UNITS: { id: 9, description: "Editar las unidades de negocio" },
    DELETE_BUSINESS_UNITS: { id: 10, description: "Remover las unidades de negocio" },
    CREATE_USERS: { id: 3, description: "Crear usuarios" },
    EDIT_USERS: { id: 4, description: "Editar usuarios" },
    DELETE_USERS: { id: 5, description: "Borrar usuarios" },
    CREATE_PAYROLL_RECEIPTS: { id: 6, description: "Generar recibos de nómina" },
    EDIT_PAYROLL: { id: 7, description: "Editar datos de nómina" },
    READ_BUSINESS_UNITS: { id: 8, description: "Leer las unidades de negocio" },
    READ_USERS: { id: 11, description: "Leer los usuarios del sistema " }            // Specify business unit?
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
