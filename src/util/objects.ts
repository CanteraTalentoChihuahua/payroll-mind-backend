export const Privileges = {
    CREATE_ADMIN: { id: 1, description: "Crear administradores" },
    CREATE_BUSINESS_UNITS: { id: 2, description: "Crear unidades de negocio" },
    CREATE_USERS: { id: 3, description: "Crear usuarios" },
    EDIT_USERS: { id: 4, description: "Editar usuarios" },
    DELETE_USERS: { id: 5, description: "Borrar usuarios" },
    CREATE_PAYROLL_RECEIPTS: { id: 6, description: "Generar recibos de nómina" },
    EDIT_PAYROLL: { id: 7, description: "Editar datos de nómina" }
}

export type Privilege = { id: number, description: string }

export type NewUserData = {
    first_name: string,
    last_name: string,
    email: string,
    payment_period: number,
    business_unit: number,
    salary: number,
    second_name: string | undefined,
    second_last_name: string | undefined
}
