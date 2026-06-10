import { useState, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { formatRp } from "@/utils/formatter";

export default function LayananKonser({ concerts, filters, artists }) {
    const { errors: pageErrors, flash } = usePage().props;
    const [search, setSearch] = useState(filters?.q || "");

    const [openModal, setOpenModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    const [deleteModal, setDeleteModal] = useState(false);
    const [concertToDelete, setConcertToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            banner: null,
            title: "",
            venue_name: "",
            city: "",
            event_date: "",
            event_time: "",
            description: "",
            status: "active",
            artist_ids: [],
            ticket_categories: [
                { category_name: "Festival", price: "", total_quota: "" },
            ],
        });

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            "/admin/layanan-konser",
            { q: search },
            { preserveState: true },
        );
    }

    function handleFile(e) {
        const file = e.target.files[0];
        if (file) {
            setData("banner", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    function handleArtistSelect(e) {
        const value = Array.from(
            e.target.selectedOptions,
            (option) => option.value,
        );
        setData("artist_ids", value);
    }

    function addCategory() {
        setData("ticket_categories", [
            ...data.ticket_categories,
            { category_name: "", price: "", total_quota: "" },
        ]);
    }

    function removeCategory(index) {
        const newCats = [...data.ticket_categories];
        newCats.splice(index, 1);
        setData("ticket_categories", newCats);
    }

    function updateCategory(index, field, value) {
        const newCats = [...data.ticket_categories];
        newCats[index][field] = value;
        setData("ticket_categories", newCats);
    }

    function submitForm(e) {
        e.preventDefault();
        post("/admin/layanan-konser", {
            onSuccess: () => {
                setOpenModal(false);
                reset();
                setPreviewUrl("");
            },
        });
    }

    function confirmDelete(concert) {
        setConcertToDelete(concert);
        setDeleteModal(true);
    }

    function handleDelete(e) {
        e.preventDefault();
        if (concertToDelete) {
            router.delete(`/admin/layanan-konser/${concertToDelete.id}`, {
                onSuccess: () => setDeleteModal(false),
            });
        }
    }

    return (
        <AdminLayout title="Layanan Konser">
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
            {flash?.error && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm font-semibold">
                    <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        />
                    </svg>
                    {flash.error}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-3 flex-wrap w-full lg:w-auto"
                    >
                        <div className="flex items-center px-4 py-2 bg-gray-50 rounded-2xl border border-gray-200 w-full sm:w-[320px]">
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
                                placeholder="Cari acara berdasarkan nama"
                                className="w-full bg-transparent border-none focus:ring-0 text-sm outline-none text-gray-900 placeholder-gray-400"
                            />
                        </div>
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
                        Tambah Acara
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="bg-blue-600 px-6 py-4 grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4 text-sm font-semibold text-white">
                                Detail Acara
                            </div>
                            <div className="col-span-2 text-sm font-semibold text-white">
                                Lokasi
                            </div>
                            <div className="col-span-2 text-sm font-semibold text-white">
                                Tanggal & Waktu
                            </div>
                            <div className="col-span-1 text-sm font-semibold text-white text-center">
                                Status
                            </div>
                            <div className="col-span-2 text-sm font-semibold text-white">
                                Tiket
                            </div>
                            <div className="col-span-1 text-sm font-semibold text-white text-center">
                                Aksi
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {concerts.length > 0 ? (
                                concerts.map((concert) => (
                                    <div
                                        key={concert.id}
                                        className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-blue-50/40 transition-colors duration-150"
                                    >
                                        {/* Detail Acara: Banner + Nama + Artis */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            {concert.banner_url ? (
                                                <img
                                                    src={concert.banner_url}
                                                    alt={concert.title}
                                                    className="w-14 h-14 object-cover rounded-xl shadow-sm flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 flex-shrink-0">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-gray-900 leading-snug">{concert.title}</p>
                                                {concert.artists.length > 0 && (
                                                    <p className="text-[11px] text-blue-500 mt-0.5 truncate">
                                                        {concert.artists.map((a) => a.name).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {/* Lokasi */}
                                        <div className="col-span-2">
                                            <p className="text-sm font-medium text-gray-800">{concert.venue_name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{concert.city}</p>
                                        </div>
                                        {/* Tanggal & Waktu */}
                                        <div className="col-span-2">
                                            <p className="text-sm font-medium text-gray-800">{concert.event_date_label}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{concert.event_time ? concert.event_time.substring(0,5) + ' WIB' : ''}</p>
                                        </div>
                                        {/* Status */}
                                        <div className="col-span-1 text-center">
                                            {concert.status === "active" ? (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Aktif</span>
                                            ) : concert.status === "draft" ? (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">Draft</span>
                                            ) : (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Selesai</span>
                                            )}
                                        </div>
                                        {/* Tiket */}
                                        <div className="col-span-2">
                                            <p className="text-sm font-semibold text-gray-800">{concert.ticket_categories.length} kategori</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{concert.available_quota?.toLocaleString('id-ID') ?? concert.ticket_categories.reduce((s, c) => s + (c.available_quota || 0), 0).toLocaleString('id-ID')} tersedia</p>
                                        </div>
                                        {/* Aksi */}
                                        <div className="col-span-1 flex items-center justify-center gap-2">
                                            <a
                                                href={`/admin/layanan-konser/${concert.id}/edit`}
                                                className="text-gray-400 hover:text-blue-600 border border-gray-200 rounded-full p-1.5 transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => confirmDelete(concert)}
                                                className="text-gray-400 hover:text-red-600 border border-gray-200 rounded-full p-1.5 transition-colors"
                                                title="Hapus"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
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
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                    <p className="text-gray-400 font-semibold text-sm mb-1">
                                        Belum ada konser
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        Klik "+ Tambah Konser" untuk memulai.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Konser */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setOpenModal(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10">
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
                            <h2 className="text-lg font-bold text-gray-900">
                                Tambah Konser Baru
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
                        <div className="flex-1 overflow-y-auto px-7 py-6">
                            <form
                                id="concertForm"
                                onSubmit={submitForm}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                                        1. Informasi Dasar
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Nama Konser{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${errors.title ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50`}
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                                Banner Konser{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            {previewUrl && (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-32 h-20 object-cover rounded-xl mb-3 shadow-sm border border-gray-200"
                                                    onError={() =>
                                                        setPreviewUrl("")
                                                    }
                                                />
                                            )}
                                            <input
                                                type="file"
                                                onChange={handleFile}
                                                accept="image/*"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                            />
                                            {errors.banner && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.banner}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Venue (Tempat){" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.venue_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "venue_name",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${errors.venue_name ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50`}
                                            />
                                            {errors.venue_name && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.venue_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Kota{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.city}
                                                onChange={(e) =>
                                                    setData(
                                                        "city",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${errors.city ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50`}
                                            />
                                            {errors.city && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Tanggal{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                value={data.event_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "event_date",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${errors.event_date ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50`}
                                            />
                                            {errors.event_date && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.event_date}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Waktu (Jam){" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="time"
                                                value={data.event_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "event_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${errors.event_time ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50`}
                                            />
                                            {errors.event_time && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.event_time}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Pilih Artis (Bisa Lebih Dari 1)
                                            </label>
                                            <select
                                                multiple
                                                value={data.artist_ids}
                                                onChange={handleArtistSelect}
                                                className={`w-full px-4 py-2 border ${errors.artist_ids ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50 min-h-[120px]`}
                                            >
                                                {artists.map((a) => (
                                                    <option
                                                        key={a.id}
                                                        value={a.id}
                                                    >
                                                        {a.name} ({a.genre})
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Tahan CTRL (Windows) atau CMD
                                                (Mac) untuk memilih lebih dari
                                                satu artis.
                                            </p>
                                            {errors.artist_ids && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.artist_ids}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Deskripsi Lengkap
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                                            ></textarea>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                                Status Publikasi{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            data.status ===
                                                            "active"
                                                        }
                                                        onChange={() =>
                                                            setData(
                                                                "status",
                                                                "active",
                                                            )
                                                        }
                                                    />{" "}
                                                    <span className="text-sm">
                                                        Aktif / Publik
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            data.status ===
                                                            "draft"
                                                        }
                                                        onChange={() =>
                                                            setData(
                                                                "status",
                                                                "draft",
                                                            )
                                                        }
                                                    />{" "}
                                                    <span className="text-sm">
                                                        Draft
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            data.status ===
                                                            "completed"
                                                        }
                                                        onChange={() =>
                                                            setData(
                                                                "status",
                                                                "completed",
                                                            )
                                                        }
                                                    />{" "}
                                                    <span className="text-sm">
                                                        Selesai
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                                        <h3 className="text-sm font-bold text-gray-900">
                                            2. Kategori Tiket{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addCategory}
                                            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            + Tambah Kategori
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {data.ticket_categories.map(
                                            (cat, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100"
                                                >
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                            Nama Kategori
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                cat.category_name
                                                            }
                                                            onChange={(e) =>
                                                                updateCategory(
                                                                    index,
                                                                    "category_name",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                            placeholder="Contoh: VIP"
                                                            className={`w-full px-3 py-2 border ${errors[`ticket_categories.${index}.category_name`] ? "border-red-400" : "border-gray-200"} rounded-lg text-sm`}
                                                        />
                                                        {errors[`ticket_categories.${index}.category_name`] && (
                                                            <p className="mt-1 text-[10px] text-red-500">
                                                                {errors[`ticket_categories.${index}.category_name`]}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                            Harga (Rp)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cat.price !== null && cat.price !== undefined && cat.price !== "" ? cat.price.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                                                            onChange={(e) =>
                                                                updateCategory(
                                                                    index,
                                                                    "price",
                                                                    e.target.value.replace(/\D/g, "")
                                                                )
                                                            }
                                                            required
                                                            placeholder="1.000.000"
                                                            className={`w-full px-3 py-2 border ${errors[`ticket_categories.${index}.price`] ? "border-red-400" : "border-gray-200"} rounded-lg text-sm`}
                                                        />
                                                        {errors[`ticket_categories.${index}.price`] && (
                                                            <p className="mt-1 text-[10px] text-red-500">
                                                                {errors[`ticket_categories.${index}.price`]}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                            Kuota Total
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={
                                                                cat.total_quota
                                                            }
                                                            onChange={(e) =>
                                                                updateCategory(
                                                                    index,
                                                                    "total_quota",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                            min="1"
                                                            placeholder="100"
                                                            className={`w-full px-3 py-2 border ${errors[`ticket_categories.${index}.total_quota`] ? "border-red-400" : "border-gray-200"} rounded-lg text-sm`}
                                                        />
                                                        {errors[`ticket_categories.${index}.total_quota`] && (
                                                            <p className="mt-1 text-[10px] text-red-500">
                                                                {errors[`ticket_categories.${index}.total_quota`]}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {data.ticket_categories
                                                        .length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeCategory(
                                                                    index,
                                                                )
                                                            }
                                                            className="mt-6 text-red-500 hover:text-red-700 p-2 bg-white rounded-lg border border-red-100 shadow-sm"
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
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    {errors.ticket_categories && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {errors.ticket_categories}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="px-7 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0 rounded-b-2xl">
                            {Object.keys(errors).length > 0 && (
                                <span className="text-red-500 text-sm font-semibold mr-auto flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Ada error, silakan periksa isian form.
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setOpenModal(false)}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="concertForm"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                {processing ? "Menyimpan..." : "Simpan Konser"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Delete */}
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
                                    Hapus Konser
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">
                            Apakah Anda yakin ingin menghapus konser{" "}
                            <strong className="text-gray-900">
                                {concertToDelete?.title}
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
