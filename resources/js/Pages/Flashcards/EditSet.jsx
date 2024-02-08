import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TextInput from "@/Components/Form/TextInput.jsx";
import Textarea from "@/Components/Form/Textarea.jsx";
import InputError from "@/Components/Form/InputError.jsx";
import { useFieldArray, useForm } from "react-hook-form";
import { Container } from "@/Components/Container";
import { MainButton } from "@/Components/MainButton.jsx";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap/all";
import InputLabel from "@/Components/Form/InputLabel.jsx";
import TranslationsData from "@/TranslationsData.js";
import { TranslationForm } from "@/Components/Translations/TranslationForm.jsx";
import { AddTranslationButton } from "@/Components/Translations/AddTranslationButton.jsx";
import Animation from "@/Pages/Animation.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ProgressModal} from "@/Components/ProgressModal.jsx";

export default function EditSet({
    auth,
    set,
    translations,
    errorsFromController,
}) {
    const mainInputsRefs = useRef([]);
    const translationsRefs = useRef([]);

    const [isAnyTranslationDeleted, setIsAnyTranslationDeleted] =
        useState(false);
    const [isSetBeingUpdated, setIsSetBeingUpdated] = useState(false);

    const { title, description } = set;

    const [fetchedTranslations] = useState(
        translations.map((translation) => {
            return new TranslationsData(translation);
        }),
    );

    const [oldTranslations] = useState(
        translations.map((translation) => {
            return new TranslationsData(translation);
        }),
    );

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {
            title: title.replaceAll("_", " "),
            description: description,
            translations: fetchedTranslations,
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "translations",
        control,
    });

    const isDataFromDictionary = {
        term: Object.keys(translations[0].term).some(
            (element) => element === "0",
        ),
        definition: Object.keys(translations[0].definition).some(
            (element) => element === "0",
        ),
    };

    useLayoutEffect(() => {
        const mainFieldsAnimation = new Animation(mainInputsRefs.current);
        const translationsAnimation = new Animation(translationsRefs.current);

        mainFieldsAnimation.animateAll("", "", "<+.2");
        translationsAnimation.animateAll("", "", "<+.1");
    }, [fields]);

    const removingAnimation = (index) => {
        let removeTl = gsap.timeline();

        removeTl.to(translationsRefs.current[index], {
            duration: 1,
            opacity: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            y: "-1rem",
        });
    };

    const deleteTranslation = (translationId, title, currentTranslationIndex) => {
        remove(currentTranslationIndex);

        router.delete(`set/${set.id}/delete/translation/${translationId}/${title}`);
    };

    const appendField = () => {
        append({
            term: {
                word: "",
                language: fetchedTranslations[0].term.language,
            },
            definition: {
                word: "",
                language: fetchedTranslations[0].definition.language,
            },
            isNew: true,
        });
    };

    const onSubmit = (data) => {
        setIsSetBeingUpdated(true);

        // Check which translations have been changed by the user
        const filteredData = data.translations.filter((translation, index) => {
            return (
                "isNew" in translation ||
                translation.term.word !== oldTranslations[index].term.word ||
                translation.definition.word !==
                    oldTranslations[index].definition.word
            );
        });

        data.translations = filteredData;

        //Remove unnecessary fields
        data.title !== title.replaceAll("_", " ")
            ? (data.isTitleDirty = true)
            : (data.isTitleDirty = false);

        data.description !== set.description
            ? (data.isDescriptionDirty = true)
            : (data.isDescriptionDirty = false);

        filteredData.length > 0
            ? (data.isTranslationDirty = true)
            : (data.isTranslationDirty = false);

        data.isDataFromDictionary = isDataFromDictionary;

        router.put(`/update-set/${set.id}/${set.title}`, data);
    };

    return (
        <AuthenticatedLayout
            fullScreen={true}
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-700 leading-tight">
                    Editing set
                    <Link
                        href={route("flashcards.showSet", [set.id, set.title])}
                        className="text-indigo-500"
                    >
                        {" "}
                        {set.title.replaceAll("_", " ")}
                    </Link>
                </h2>
            }
        >
            <Head title={`Editing set - ${set.title}`} />

            <Container className="bg-white">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-2 text-gray-900 flex gap-4 flex-col"
                >
                    <div
                        className="bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-md shadow-md p-4 polygon-start opacity-0 translate-y-12"
                        ref={(element) => (mainInputsRefs.current[0] = element)}
                    >
                        <div
                            className={
                                "flex items-center justify-between gap-4"
                            }
                        >
                            <div className={"shadow-lg w-full self-start"}>
                                <InputLabel
                                    htmlFor={"title"}
                                    className={"text-white"}
                                >
                                    Title
                                </InputLabel>
                                <TextInput
                                    id={"title"}
                                    placeholder={"Enter a title"}
                                    className="w-full"
                                    name="title"
                                    {...register("title", {
                                        required: {
                                            value: true,
                                            message: "Field title is required",
                                        },
                                    })}
                                />
                            </div>
                            <div className="shadow-lg w-full">
                                <InputLabel
                                    htmlFor={"description"}
                                    className={"text-white"}
                                >
                                    Description
                                </InputLabel>
                                <Textarea
                                    placeholder="Add a description"
                                    name="description"
                                    {...register("description", {
                                        required: {
                                            value: true,
                                            message:
                                                "Field description is required",
                                        },
                                    })}
                                />
                            </div>
                        </div>
                        <div className={"space-y-4"}>
                            {errors.title && (
                                <InputError message={errors.title.message} />
                            )}
                            {errors.description && (
                                <InputError
                                    message={errors.description.message}
                                    className="mt-4"
                                />
                            )}
                            {errorsFromController.title && (
                                <InputError
                                    message={errorsFromController.title}
                                />
                            )}
                            {errors.translations && (
                                <InputError message="Fields in translations must be filled" />
                            )}
                            {errorsFromController.translations && (
                                <InputError
                                    message={errorsFromController.translations}
                                />
                            )}
                        </div>
                    </div>

                    <div className={"overflow-y-scroll max-h-[50vh] space-y-4"}>
                        {fields.map((field, index) => (
                            <TranslationForm
                                key={index}
                                index={index}
                                ref={(element) =>
                                    (translationsRefs.current[index] = element)
                                }
                                title={title}
                                handleDeleteTranslation={deleteTranslation}
                                handleIsDeletedAnyTranslation={
                                    setIsAnyTranslationDeleted
                                }
                                termRegister={register(
                                    `translations.${index}.term.word`,
                                    {
                                        required: {
                                            value: true,
                                            message: "Field term is required",
                                        },
                                    },
                                )}
                                definitionRegister={register(
                                    `translations.${index}.definition.word`,
                                    {
                                        required: {
                                            value: true,
                                            message:
                                                "Field definition is required",
                                        },
                                    },
                                )}
                                handleRemovingAnimation={removingAnimation}
                                translationId={getValues(
                                    `translations.${index}.id`,
                                )}
                            />
                        ))}
                    </div>

                    <AddTranslationButton
                        ref={(element) => (mainInputsRefs.current[1] = element)}
                        handleAppendField={appendField}
                    />
                    <div
                        className="flex justify-end polygon-start opacity-0 translate-y-12"
                        ref={(element) => {
                            mainInputsRefs.current[2] = element;
                        }}
                    >
                        <MainButton
                            isRedirect={isAnyTranslationDeleted}
                            href={
                                isAnyTranslationDeleted
                                    ? route("flashcards.showSet", [
                                          set.id,
                                          set.title,
                                      ])
                                    : ""
                            }
                            className="inline-block py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition"
                        >
                            Update
                        </MainButton>
                    </div>
                </form>
            </Container>

            <ProgressModal isVisible={isSetBeingUpdated} text={"We're updating your set."} />
        </AuthenticatedLayout>
    );
}