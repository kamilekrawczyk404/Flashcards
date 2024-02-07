import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const linesStyle =
        "relative before:absolute before:-right-[13rem] before:bottom-0 before:bg-indigo-500 before:w-1/2 before:h-1 before:transform before:-rotate-45 after:absolute after:-right-[15rem] after:bottom-0 after:bg-indigo-500 after:w-1/2 after:h-1 after:transform after:-rotate-45 overflow-hidden";
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-indigo-500 leading-tight">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div
                        className={
                            "p-4 sm:p-8 bg-white shadow sm:rounded-lg " +
                            linesStyle
                        }
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                    <div
                        className={
                            "p-4 sm:p-8 bg-white shadow sm:rounded-lg " +
                            linesStyle
                        }
                    >
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div
                        className={
                            "p-4 sm:p-8 bg-white shadow sm:rounded-lg " +
                            linesStyle
                        }
                    >
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}