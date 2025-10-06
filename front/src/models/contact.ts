export interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface EditContact {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}