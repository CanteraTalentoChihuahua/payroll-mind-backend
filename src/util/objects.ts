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
    READ_BUSINESS_UNITS: { id: 8, description: "Leer las unidades de negocio" }
}

export type Privilege = { id: number, description: string }