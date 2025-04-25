'use client';
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { transactionValidationSchema } from "@/utils/validationSchemas";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { MdDeleteForever, MdDirectionsBus } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import apiClient from "@/utils/apiMiddleware";

interface Category {
    _id: string;
    type: "income" | "expense";
    name: string;
}

type FormData = Yup.InferType<typeof transactionValidationSchema>;

export default function EditExpense() {
    const searchParams = useSearchParams();
    const id = searchParams?.get("id") || ""; // Get the "id" from the query string or default to an empty string
    const router = useRouter();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(transactionValidationSchema), // Integrate Yup validation
    });

    const selectedCategory = watch("category");
    const selectedDate = watch("date")?.toString() || new Date().toISOString().split("T")[0]; // Default to today if not set

    // Fetch transaction and categories using React Query
    const { data: categories, error: fetchError } = useQuery({
        queryKey: ["transaction", id],
        queryFn: async () => {
            // Fetch transaction details
            const transactionResponse = await apiClient.get(`/transactions/${id}`);
            const transaction = transactionResponse.data;

            // Set form values
            setValue("category", transaction.category?._id || "");
            setValue("amount", transaction.amount || 0);
            setValue("note", transaction.note || "");
            setValue("date", new Date(transaction.date));

            // Fetch categories
            const categoriesResponse = await apiClient.get("/categories");
            return categoriesResponse.data;
        }
    });

    // Mutation for updating the transaction
    const updateMutation = useMutation({
        mutationFn: async (data: FormData) => {
            await apiClient.put(`/transactions/${id}`, { ...data, type: "expense" });
        },
        onSuccess: () => {
            router.push("/");
        },
        onError: (error) => {
            console.error("Error updating transaction:", error);
        },
    });

    // Mutation for deleting the transaction
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await apiClient.delete(`/transactions/${id}`);
        },
        onSuccess: () => {
            router.push("/");
        },
        onError: (error) => {
            console.error("Error deleting transaction:", error);
        },
    });

    const onSubmit = (data: FormData) => {
        updateMutation.mutate(data);
    };

    const handleDelete = () => {
        if (confirm("ဤငွေစာရင်းကို ဖျက်လိုသည်မှာ သေချာပါသလား။")) {
            deleteMutation.mutate();
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-blue-500 text-white text-center py-4 sticky top-0 z-10">
                <Link href="/" className="absolute left-4 top-3 text-white text-xl">
                    <HiChevronLeft className="text-4xl" />
                </Link>
                <h1 className="text-lg font-semibold">ပြင်ဆင်ရန်</h1>
                <button
                    onClick={handleDelete}
                    className="absolute right-4 top-3 text-white text-xl"
                >
                    <MdDeleteForever className="text-4xl" />
                </button>
            </div>

            {/* Error Message */}
            {fetchError && (
                <div className="w-full px-6 mt-4">
                    <p className="text-red-500 text-sm">Error fetching data: {fetchError.message}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full px-6 pb-6 mt-4">
                {/* Category Selection */}
                <div className="text-black font-medium text-base">အမျိုးအစားရွေးရန်</div>
                <div className="mt-4">
                    {!selectedCategory ? (
                        <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                            {categories
                                ?.filter((item: Category) => item.type === "expense")
                                .map((item: Category, index: number) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center text-sm text-black cursor-pointer ${
                                            selectedCategory === item._id ? "border-2 border-blue-500" : ""
                                        }`}
                                        onClick={() => setValue("category", item._id)}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${
                                                index % 2 === 0 ? "bg-green-500" : "bg-yellow-500"
                                            }`}
                                        >
                                            <MdDirectionsBus />
                                        </div>
                                        <span className="mt-2 text-center">{item.name}</span>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
                            <span className="text-black font-medium">
                                {categories?.find((item: Category) => item._id === selectedCategory)?.name}
                            </span>
                            <button
                                type="button"
                                onClick={() => setValue("category", "")}
                                className="text-black font-semibold"
                            >
                                <FiEdit className="inline-block mr-1" />
                            </button>
                        </div>
                    )}
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>

                {/* Amount Input */}
                <div className="mt-6">
                    <label className="text-black font-medium">ပမာဏ</label>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        {...register("amount")}
                        className="w-full mt-2 p-2 rounded-md bg-blue-50 text-black"
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                </div>

                {/* Note Input */}
                <div className="mt-6">
                    <label className="text-black font-medium">မှတ်စု</label>
                    <textarea
                        placeholder="Enter note"
                        rows={4}
                        {...register("note")}
                        className="w-full mt-2 p-2 rounded-md bg-blue-50 text-black"
                    ></textarea>
                    {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>}
                </div>

                {/* Date Input */}
                <div className="mt-6">
                    <label className="text-black font-medium">နေ့ ရက်</label>
                    <input
                        type="date"
                        {...register("date")}
                        value={new Date(selectedDate).toISOString().split('T')[0]}
                        required
                        className="w-full mt-2 p-2 rounded-md bg-blue-50 text-black"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        type="submit"
                        disabled={
                            updateMutation.status === 'pending' ||
                            !selectedCategory ||
                            !watch("amount") ||
                            !watch("date")
                        }
                        className={`w-full bg-blue-500 text-white py-3 rounded-full font-semibold ${
                            updateMutation.status === 'pending' ||
                            !selectedCategory ||
                            !watch("amount") ||
                            !watch("date") ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {updateMutation.status === 'pending' ? "လုပ်ဆောင်ဆဲ..." : "အတည်ပြုမည်"}
                    </button>
                    <Link
                        href="/"
                        className="w-full border border-blue-500 text-black py-3 rounded-full font-semibold text-center block"
                    >
                        ပယ်ဖျက်မည်
                    </Link>
                </div>
            </form>
        </div>
    );
}
