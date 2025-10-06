import {create} from "zustand";
import type {Contact, EditContact} from "../models/contact.ts";
import {axiosInstance} from "../utils/utils.ts";

interface ContactStore {
    contact: Contact[];
    singleContact: Contact | null;
    fetchUserContact: () => Promise<void>;
    resetStore: () => void;
    editContact: (id: string, editedContact: EditContact) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    fetchSingleContact: (id: string) => Promise<void>;
    createContact: (newContact: EditContact) => Promise<void>;
}

const useContactStore = create<ContactStore>((set, get) => ({
    contact: [],
    singleContact: null,
    fetchUserContact: async () => {
        try {
            const res = await axiosInstance.get("/contacts", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })

            set({contact: res.data.data.contact.reverse()});
        } catch (err) {
            console.error(err);
        }
    },
    editContact: async (id: string, editedContact: EditContact) => {
        try {
            await axiosInstance.patch(`contact/${id}`, editedContact, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            await get().fetchUserContact();
        } catch (err) {
            console.error(err);
        }
    },
    deleteContact: async (id: string) => {
        try {
            await axiosInstance.delete(`contact/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            const {contact} = get();
            const updatedContacts = contact.filter((c) => c._id !== id);

            set({contact: updatedContacts});
        } catch (err) {
            console.error(err);
        }
    },
    fetchSingleContact: async (id: string) => {
        try {
            const res = await axiosInstance.get(`contact/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })

            set({singleContact: res.data.data.contact})
        } catch (err) {
            console.error(err);
        }
    },
    createContact: async (newContact: EditContact) => {
        try {
            await axiosInstance.post("contact", newContact, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })

            await get().fetchUserContact()
        } catch (err) {
            console.error(err);
        }
    },
    resetStore: () => set({contact: [], singleContact: null}),
}))

export default useContactStore;