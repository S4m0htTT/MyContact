import {X} from "lucide-react";
import {useEffect, useState} from "react";
import useContactStore from "../stores/contactStore.ts";

interface CreateContactDialogProps {
    onClose: () => void
    id: string
}

const fields = [
    {name: "firstName", label: "Prénom", required: true},
    {name: "lastName", label: "Nom", required: true},
    {name: "phoneNumber", label: "Téléphone", required: true},
]

interface FormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export default function UpdateContactDialog({onClose, id}: CreateContactDialogProps) {

    const [formData, setFormData] = useState<FormData>({firstName: "", lastName: "", phoneNumber: ""});
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const {editContact, fetchSingleContact, singleContact} = useContactStore()

    useEffect(() => {
        void fetchSingleContact(id).finally(() => setIsFetching(false))
    }, [id]);

    useEffect(() => {
        if (!singleContact) return;

        const timeout = setTimeout(() => {
            setFormData({
                firstName: singleContact.firstName,
                lastName: singleContact.lastName,
                phoneNumber: singleContact.phoneNumber
            });
        }, 100);

        return () => clearTimeout(timeout);
    }, [singleContact]);


    const handleChange = (fieldName: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const validateForm = () => {
        const {firstName, lastName, phoneNumber} = formData;

        if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return false;
        }

        const phoneRegex = /^(\+?[0-9]{1,3})?[0-9]{6,15}$/;
        if (!phoneRegex.test(phoneNumber.replaceAll(" ", ""))) {
            setError("Numéro de téléphone invalide.");
            return false;
        }

        return true;
    }

    const handleCreateContact = async () => {
        if (!validateForm()) return;

        setIsLoading(true)
        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phoneNumber: formData.phoneNumber.trim(),
        }

        try {
            await editContact(id, payload).finally(() => setIsLoading(false));
            setFormData({firstName: "", lastName: "", phoneNumber: ""})
            setError("");
            onClose()
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de la modification du contact.");
        }
    }

    const isSaveDisabled = formData.firstName.trim() === "" || formData.lastName.trim() === "" || formData.phoneNumber.trim() === "";

    return (
        <div className="flex items-center overflow-x-hidden">
            <div className="fixed inset-0 w-screen h-screen bg-black/75"/>
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 w-xl bg-black border border-white/30 rounded-lg shadow-md shadow-white/10">

                {
                    isFetching
                        ? (
                            <div className="flex justify-center items-center mt-10">
                                <div
                                    className="size-16 border-[6px] text-[#616161] text-xl animate-spin border-gray-300 flex items-center justify-center border-t-[#616161] rounded-full"/>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <X
                                        strokeWidth={1.5}
                                        className="ml-auto cursor-pointer"
                                        onClick={onClose}
                                    />
                                </div>
                                <h1 className="text-lg font-medium">Modification
                                    de <b>{singleContact?.firstName} {singleContact?.lastName}</ b>
                                </h1>
                                {
                                    error !== "" && (
                                        <p className="text-red-500 mt-2  text-muted-foreground text-sm">{error}</p>
                                    )
                                }
                                <div className="flex flex-col gap-4 mt-5">
                                    {
                                        fields.map(({name, label, required}, i) => {
                                            return (
                                                <div key={i}>
                                                    <label htmlFor={name} className="mb-2 text-lg block">{label}</label>
                                                    <input
                                                        value={formData[name as keyof FormData]}
                                                        onChange={(e) => handleChange(name as keyof FormData, e.target.value)}
                                                        type="text"
                                                        id={name}
                                                        required={required}
                                                        className="bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 rounded-md px-3 py-2 w-full focus:outline-none"
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex justify-end gap-4 mt-5">
                                    <button
                                        className="bg-red-600 text-white hover:bg-red-700 focus:outline-none cursor-pointer px-4 py-1 rounded-sm"
                                        onClick={onClose}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        className={`border focus:outline-none px-4 py-1 rounded-sm ${isSaveDisabled ? "text-white/50 border-white/30 cursor-not-allowed" : "text-white border border-white/30 hover:border-white/45 cursor-pointer"}`}
                                        onClick={handleCreateContact}
                                        disabled={isSaveDisabled}
                                    >
                                        {isLoading ? "Chargement ..." : "Enregistrer"}
                                    </button>
                                </div>
                            </>
                        )
                }
            </div>
        </div>
    )
}