import { useState, useRef, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, useForm, usePage } from "@inertiajs/react";

export default function Artis({ artists, filters, genres }) {
    const { errors: pageErrors, flash } = usePage().props;
    const [search, setSearch] = useState(filters?.q || "");
    const [genre, setGenre] = useState(filters?.genre || "");

    const [openModal, setOpenModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    const [deleteModal, setDeleteModal] = useState(false);
    const [artistToDelete, setArtistToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            photo: null,
            name: "",
            slug: "",
            genre: "",
            origin: "",
            instagram_url: "",
            is_active: "1",
        });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setOpenModal(true);
        }
    }, [errors]);

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            "/admin/artis",
            { q: search, genre },
            { preserveState: true },
        );
    }

    function handleGenreChange(e) {
        const val = e.target.value;
        setGenre(val);
        router.get(
            "/admin/artis",
            { q: search, genre: val },
            { preserveState: true },
        );
    }

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
        setData("name", e.target.value);
        setData("slug", generateSlug(e.target.value));
    }

    function submitForm(e) {
        e.preventDefault();
        post("/admin/artis", {
            onSuccess: () => {
                setOpenModal(false);
                reset();
                setPreviewUrl("");
            },
        });
    }

    function confirmDelete(artist) {
        setArtistToDelete({
            id: artist.id,
            name: artist.name,
            concertCount: 0, // Note: Ideally returned from backend, setting to 0 for simplicity or fetch if needed. We can just say it will be disabled.
        });
        setDeleteModal(true);
    }

    function handleDelete(e) {
        e.preventDefault();
        if (artistToDelete) {
            router.delete(`/admin/artis/${artistToDelete.id}`, {
                onSuccess: () => setDeleteModal(false),
            });
        }
    }

    return (
        <AdminLayout title="Manajemen Artis">
            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-xl text-sm font-semibold">
                    <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {flash.success}
                </div>
            )}

            {Object.keys(pageErrors).length > 0 && !openModal && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm">
                    <p className="font-bold mb-2">
                        Terdapat kesalahan pada form:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        {Object.values(pageErrors).map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-3 flex-wrap w-full lg:w-auto"
                    >
                        <div className="flex items-center px-4 py-2 bg-gray-50 rounded-2xl border border-gray-200 w-full sm:w-[300px]">
                            <svg
                                className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama artis..."
                                className="w-full bg-transparent border-none focus:ring-0 text-sm outline-none text-gray-900 placeholder-gray-400"
                            />
                        </div>

                        <select
                            value={genre}
                            onChange={handleGenreChange}
                            className="px-4 py-2 bg-white rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Genre</option>
                            {genres.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </form>

                    <button
                        onClick={() => {
                            clearErrors();
                            setOpenModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm"
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Tambah Artis
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="bg-blue-600 px-6 py-4 grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-1 text-sm font-semibold text-white">
                                Foto
                            </div>
                            <div className="col-span-3 text-sm font-semibold text-white">
                                Nama Artis
                            </div>
                            <div className="col-span-2 text-sm font-semibold text-white">
                                Genre
                            </div>
                            <div className="col-span-2 text-sm font-semibold text-white">
                                Asal/Kota
                            </div>
                            <div className="col-span-2 text-sm font-semibold text-white">
                                Status
                            </div>
                            <div className="col-span-2 text-sm font-semibold text-white text-center">
                                Aksi
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {artists.data.length > 0 ? (
                                artists.data.map((artist) => (
                                    <div
                                        key={artist.id}
                                        className={`px-6 py-4 grid grid-cols-12 gap-4 items-center transition-colors duration-150 ${artist.deleted_at ? "bg-red-50/40" : "hover:bg-blue-50/40"}`}
                                    >
                                        <div className="col-span-1">
                                            {artist.image_url ? (
                                                <img
                                                    src={artist.image_url}
                                                    alt={artist.name}
                                                    className={`w-12 h-12 object-cover rounded-xl border border-gray-200 ${artist.deleted_at ? "opacity-50" : ""}`}
                                                />
                                            ) : (
                                                <div
                                                    className={`w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center ${artist.deleted_at ? "opacity-50" : ""}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-blue-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-3">
                                            <p
                                                className={`font-bold text-sm text-gray-900 ${artist.deleted_at ? "line-through text-gray-400" : ""}`}
                                            >
                                                {artist.name}
                                            </p>
                                            {artist.instagram_url && (
                                                <a
                                                    href={artist.instagram_url}
                                                    target="_blank"
                                                    className="text-xs text-blue-500 hover:underline truncate block max-w-[180px]"
                                                >
                                                    {artist.instagram_url}
                                                </a>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                                                {artist.genre || "—"}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-600">
                                                {artist.origin || "—"}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            {artist.deleted_at ? (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                                                    Dihapus
                                                </span>
                                            ) : artist.is_active ? (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex items-center justify-center gap-2">
                                            {!artist.deleted_at ? (
                                                <>
                                                    <a
                                                        href={`/admin/artis/${artist.id}/edit`}
                                                        className="text-gray-400 hover:text-blue-600 border border-gray-200 rounded-full p-1.5 transition-colors"
                                                        title="Edit"
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
                                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            confirmDelete(
                                                                artist,
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-red-600 border border-gray-200 rounded-full p-1.5 transition-colors"
                                                        title="Hapus"
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-16 text-center">
                                    <svg
                                        className="w-16 h-16 text-gray-200 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <p className="text-gray-400 font-semibold text-sm mb-1">
                                        Belum ada artis
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        Klik "+ Tambah Artis" untuk menambahkan
                                        artis pertama.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {artists.links && artists.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex gap-1">
                        {artists.links.map((link, i) => {
                            if (link.url === null) {
                                return (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() =>
                                        router.get(
                                            link.url,
                                            { q: search, genre },
                                            { preserveState: true },
                                        )
                                    }
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${link.active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-blue-600"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Tambah Artis */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setOpenModal(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto z-10">
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-gray-900">
                                Tambah Artis Baru
                            </h2>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div className="px-7 py-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        Foto Artis{" "}
                                        <span className="text-red-500">*</span>{" "}
                                        <span className="text-gray-400 font-normal normal-case">
                                            (JPG/PNG)
                                        </span>
                                    </label>
                                    {previewUrl && (
                                        <div className="mb-3">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-2xl border-2 border-blue-200 shadow-sm"
                                                onError={() =>
                                                    setPreviewUrl("")
                                                }
                                            />
                                        </div>
                                    )}
                                    <label
                                        className={`flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed ${errors.photo ? "border-red-400" : "border-gray-200"} rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors`}
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-500">
                                            Klik untuk upload foto artis
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={handleFile}
                                        />
                                    </label>
                                    {errors.photo && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Nama Artis{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="Contoh: Dewa 19"
                                        className={`w-full px-4 py-2.5 border ${errors.name ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
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
                                        className={`w-full px-4 py-2.5 border ${errors.slug ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono`}
                                    />
                                    {errors.slug && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.slug}
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                            Genre
                                        </label>
                                        <input
                                            type="text"
                                            value={data.genre}
                                            onChange={(e) =>
                                                setData("genre", e.target.value)
                                            }
                                            placeholder="Contoh: Pop, Rock, Jazz"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
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
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
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
                                        className={`w-full px-4 py-2.5 border ${errors.instagram_url ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                                    />
                                    {errors.instagram_url && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.instagram_url}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        Status
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={data.is_active === "1"}
                                                onChange={() =>
                                                    setData("is_active", "1")
                                                }
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Aktif
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={data.is_active === "0"}
                                                onChange={() =>
                                                    setData("is_active", "0")
                                                }
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Nonaktif
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 sticky bottom-0 bg-white">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
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
                                        : "Simpan Artis"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setDeleteModal(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Hapus Artis
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">
                            Apakah Anda yakin ingin menghapus artis{" "}
                            <strong className="text-gray-900">
                                {artistToDelete?.name}
                            </strong>
                            ?
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModal(false)}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <form onSubmit={handleDelete}>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                                >
                                    Hapus
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
