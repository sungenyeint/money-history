'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { transactionValidationSchema } from "@/utils/validationSchemas";
import { FiEdit } from "react-icons/fi";
import { HiChevronLeft } from "react-icons/hi";
import { MdDirectionsBus } from "react-icons/md";
import apiClient from "@/utils/apiMiddleware";

interface Category {
    _id: string;
    name: string;
    type: "income" | "expense";
}


type FormData = Yup.InferType<typeof transactionValidationSchema>;

export default function Expense() {
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

    // Fetch categories using React Query
    const { data: categories = [], error: categoriesError } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await apiClient.get("/categories");
            return response.data;
        },
    });

    // Mutation for submitting the form
    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            await apiClient.post("/transactions", { ...data, type: "expense" });
        },
        onSuccess: () => {
            router.push("/");
        },
        onError: (error) => {
            console.error("Error posting transaction:", error);
        },
    });

    const onSubmit = (data: FormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-blue-500 text-white text-center py-4 sticky top-0 z-10">
                <Link href="/" className="absolute left-4 top-3 text-white text-xl">
                    <HiChevronLeft className="text-4xl" />
                </Link>
                <h1 className="text-lg font-semibold">အသုံးစရင်းရေးသွင်း</h1>
            </div>

            {/* Error Message */}
            {categoriesError && (
                <div className="w-full px-6 mt-4">
                    <p className="text-red-500 text-sm">Error fetching categories: {categoriesError.message}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full px-6 pb-6 mt-4">
                {/* Category Selection */}
                <div className="text-black-700 font-medium text-base">အမျိုးအစားရွေးရန်</div>
                <div className="mt-4">
                    {!selectedCategory ? (
                        <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                            {categories
                                .filter((item) => item.type === "expense")
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center text-sm text-black-700 cursor-pointer ${
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
                            <span className="text-black-700 font-medium">
                                {categories.find((item) => item._id === selectedCategory)?.name}
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
                    <label className="text-black-700 font-medium">ပမာဏ</label>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        {...register("amount")}
                        required
                        min={1}
                        className="w-full mt-2 p-2 rounded-md bg-blue-50 text-black"
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                </div>

                {/* Notes Input */}
                <div className="mt-6">
                    <label className="text-black font-medium">မှတ်စု</label>
                    <textarea
                        placeholder="Enter Notes"
                        rows={4}
                        maxLength={200}
                        {...register("note")}
                        className="w-full mt-2 p-2 rounded-md bg-blue-50 text-black"
                    ></textarea>
                    {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>}
                </div>

                {/* Date Picker */}
                <div className="mt-6">
                    <label className="text-black-700 font-medium">နေ့ ရက်</label>
                    <input
                        type="date"
                        {...register("date")}
                        required
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="w-full mt-2 p-2 rounded-md bg-blue-50 text-black"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        type="submit"
                        disabled={
                            mutation.status === 'pending' ||
                            !selectedCategory ||
                            !watch("amount") ||
                            !watch("date")
                        }
                        className={`w-full bg-blue-500 text-white py-3 rounded-full font-semibold ${
                            mutation.status === 'pending' ||
                            !selectedCategory ||
                            !watch("amount") ||
                            !watch("date") ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {mutation.status === 'pending' ? "လုပ်ဆောင်ဆဲ..." : "အတည်ပြုမည်"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setValue("category", "");
                            setValue("amount", 0);
                            setValue("note", "");
                            setValue("date", new Date());
                        }}
                        className="w-full border border-blue-500 text-black py-3 rounded-full font-semibold"
                    >
                        ပယ်ဖျက်မည်
                    </button>
                </div>
            </form>
        </div>
    );
}
