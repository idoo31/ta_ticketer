import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, useForm, usePage } from "@inertiajs/react";

export default function EditArtis({ artist, concertsCount = 0 }) {
    const { errors: pageErrors } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState(artist.image_url || "");

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        photo: null,
        name: artist.name || "",
        slug: artist.slug || "",
        genre: artist.genre || "",
        origin: artist.origin || "",
        instagram_url: artist.instagram_url || "",
        is_active: artist.is_active ? "1" : "0",
    });

    function handleFile(e) {
        const file = e.target.files[0];
        if (file) {
            setData("photo", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    function generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function handleNameChange(e) {
        const newName = e.target.value;
        setData({
            ...data,
            name: newName,
            slug: generateSlug(newName),
        });
    }

    function submitForm(e) {
        e.preventDefault();
        post(`/admin/artis/${artist.id}`);
    }

    return (
        <AdminLayout title="Edit Artis">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <a
                        href="/admin/artis"
                        className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </a>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            Edit Artis
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Perbarui informasi detail artis.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_0.9fr] gap-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <form onSubmit={submitForm}>
                            <div className="p-6 sm:p-8 space-y-6">
                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        Foto Artis{" "}
                                        <span className="text-gray-400 font-normal normal-case">
                                            (opsional, biarkan kosong jika tidak
                                            ingin mengubah)
                                        </span>
                                    </label>
                                    {previewUrl && (
                                        <div className="mb-4">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-28 h-28 object-cover rounded-2xl border-4 border-blue-50 shadow-sm"
                                                onError={() =>
                                                    setPreviewUrl("")
                                                }
                                            />
                                        </div>
                                    )}
                                    <label
                                        className={`flex items-center gap-3 w-full px-5 py-4 border-2 border-dashed ${errors.photo ? "border-red-400" : "border-gray-200"} rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-5 h-5 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">
                                                Klik untuk upload foto baru
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Format JPG/PNG, maks. 2MB
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={handleFile}
                                        />
                                    </label>
                                    {errors.photo && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        Nama Artis{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="Contoh: Dewa 19"
                                        className={`w-full px-4 py-2.5 border ${errors.name ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        Slug{" "}
                                        <span className="text-gray-400 font-normal normal-case">
                                            (auto dari nama)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        placeholder="dewa-19"
                                        className={`w-full px-4 py-2.5 border ${errors.slug ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-mono`}
                                    />
                                    {errors.slug && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.slug}
                                        </p>
                                    )}
                                </div>

                                {/* Genre & Origin */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                            Genre
                                        </label>
                                        <input
                                            type="text"
                                            value={data.genre}
                                            onChange={(e) =>
                                                setData("genre", e.target.value)
                                            }
                                            placeholder="Contoh: Pop, Rock, Jazz"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                            Asal / Kota
                                        </label>
                                        <input
                                            type="text"
                                            value={data.origin}
                                            onChange={(e) =>
                                                setData(
                                                    "origin",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Jakarta"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                                        />
                                    </div>
                                </div>

                                {/* Instagram */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        Instagram / Website{" "}
                                        <span className="text-gray-400 font-normal normal-case">
                                            (opsional)
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={data.instagram_url}
                                        onChange={(e) =>
                                            setData(
                                                "instagram_url",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://instagram.com/artis"
                                        className={`w-full px-4 py-2.5 border ${errors.instagram_url ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50`}
                                    />
                                    {errors.instagram_url && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.instagram_url}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                                        Status
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2.5 cursor-pointer">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        data.is_active === "1"
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            "is_active",
                                                            "1",
                                                        )
                                                    }
                                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-800">
                                                Aktif
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2.5 cursor-pointer">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        data.is_active === "0"
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            "is_active",
                                                            "0",
                                                        )
                                                    }
                                                    className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-800">
                                                Nonaktif
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                {Object.keys(errors).length > 0 && (
                                    <span className="text-red-500 text-sm font-semibold mr-auto flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Ada error, silakan periksa isian form.
                                    </span>
                                )}
                                <a
                                    href="/admin/artis"
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <aside className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">
                            Foto Saat Ini
                        </h3>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-[220px] object-cover rounded-2xl border border-gray-200 shadow-sm"
                                onError={() => setPreviewUrl("")}
                            />
                        ) : (
                            <div className="w-full h-[220px] rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                Tidak ada gambar
                            </div>
                        )}

                        {/* Informasi */}
                        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <p className="text-sm font-bold text-blue-700 mb-3">Informasi</p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2 text-xs text-blue-700">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        Artis ini terhubung ke{" "}
                                        <span className="font-bold">{concertsCount} konser</span>.
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-blue-700">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <span>Upload foto baru akan menggantikan foto lama.</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AdminLayout>
    );
}
