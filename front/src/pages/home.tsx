import useUserStore from "../stores/userStore.ts";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {LogOut} from "lucide-react";
import useContactStore from "../stores/contactStore.ts";
import DeleteContactDialog from "../components/delete-contact-dialog.tsx";
import type {Contact} from "../models/contact.ts"
import CreateContactDialog from "../components/create-contact-dialog.tsx";
import UpdateContactDialog from "../components/update-contact-dialog.tsx";
import {formatDate} from "../utils/utils.ts";

export default function Home() {
    const {logout, fetchUserInfo, userInfo} = useUserStore();
    const {contact, fetchUserContact, resetStore} = useContactStore();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
    const [openCreateContact, setOpenCreateContact] = useState<boolean>(false);
    const [openUpdateContact, setOpenUpdateContact] = useState<boolean>(false);
    const [updateContact, setUpdateContact] = useState<string | null>(null);

    const closeDeleteDialog = () => {
        setDeleteContact(null);
        setOpen(false);
    }

    const openDeleteContactDialog = (contact: Contact) => {
        setDeleteContact(contact);
        setOpen(true);
    }

    const closeCreateContactDialog = () => {
        setOpenCreateContact(false);
    }

    const openUpdateContactDialog = (id: string) => {
        setUpdateContact(id)
        setOpenUpdateContact(true);
    }

    const handleCloseUpdateContactDialog = () => {
        setOpenUpdateContact(false);
        setUpdateContact(null);
    }

    useEffect(() => {
        void fetchUserInfo();
        const delayFetch = setTimeout(() => {
            void fetchUserContact().finally(() => setIsLoading(false));
        }, 300)
        return () => clearTimeout(delayFetch);
    }, []);

    const handleLogout = () => {
        logout();
        resetStore();
        navigate("/login");
    };

    return (
        <div className={`min-h-screen bg-black text-white px-6 py-8 ${open ? "overflow-hidden" : ""}`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">MyContact</h1>
                    <div
                        className="flex items-center gap-2 cursor-pointer bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md border border-white/30 hover:bg-white/20 transition"
                        onClick={handleLogout}
                    >
                        <p className="text-sm">{userInfo?.email}</p>
                        <LogOut strokeWidth={1.5} size={20}/>
                    </div>
                </div>

                <div className="mb-6">
                    <p
                        className="text-xl font-semibold w-fit ml-auto border px-4 py-2 border-white/30 hover:border-white/45 rounded-md cursor-pointer"
                        onClick={() => setOpenCreateContact(true)}
                    >
                        Ajouter un contact
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div
                            className="size-16 border-[6px] text-[#616161] text-xl animate-spin border-gray-300 flex items-center justify-center border-t-[#616161] rounded-full"/>
                    </div>
                ) : contact.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contact.map((contact) => (
                            <div
                                key={contact._id}
                                className="bg-white/10 backdrop-blur-md border border-white/30 rounded-lg p-6 shadow-md shadow-white/10"
                            >
                                <p className="text-lg font-semibold mb-1">
                                    {contact.firstName} {contact.lastName}
                                </p>
                                <p className="text-sm mb-1">{contact.phoneNumber}</p>
                                <p className="text-xs mb-1">Créé : {formatDate(contact.createdAt)}</p>
                                <p className="text-xs mb-3">Modifié : {formatDate(contact.updatedAt)}</p>
                                <div className="flex gap-4 text-sm">
                                    <button
                                        className="text-blue-300 hover:underline cursor-pointer"
                                        onClick={() => {
                                            openUpdateContactDialog(contact._id)
                                        }}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="text-red-300 hover:underline cursor-pointer"
                                        onClick={() => {
                                            openDeleteContactDialog(contact)
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        <p className="text-white/80 text-lg">Aucun contact enregistré.</p>
                    </div>
                )}
            </div>
            {
                deleteContact && open && (
                    <DeleteContactDialog contact={deleteContact} onClose={closeDeleteDialog}/>
                )
            }
            {
                openCreateContact && (
                    <CreateContactDialog onClose={closeCreateContactDialog}/>
                )
            }
            {
                updateContact && openUpdateContact && (
                    <UpdateContactDialog onClose={handleCloseUpdateContactDialog} id={updateContact} />
                )
            }
        </div>
    );
}
