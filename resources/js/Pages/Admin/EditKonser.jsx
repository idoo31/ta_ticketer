import { useState, useRef, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import VenueSearchPicker from "@/Components/VenueSearchPicker";

export default function EditKonser({ concert, artists }) {
    const { errors: pageErrors, flash } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState(concert.banner_url || "");

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        banner: null,
        title: concert.title || "",
        venue_name: concert.venue_name || "",
        city: concert.city || "",
        event_date: concert.event_date || "",
        event_time: concert.event_time || "",
        description: concert.description || "",
        status: concert.status || "active",
        latitude: concert.latitude || "",
        longitude: concert.longitude || "",
        artist_ids: concert.artists.map((a) => a.id.toString()) || [],
        ticket_categories: concert.ticket_categories || [
            { category_name: "Festival", price: "", total_quota: "" },
        ],
    });

    // --- Autocomplete Artis ---
    const [artistSearch, setArtistSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const artistInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Artis yang saat ini terpilih (array of artist objects)
    const [selectedArtists, setSelectedArtists] = useState(
        concert.artists.map((a) => ({ id: a.id, name: a.name, genre: artists.find(x => x.id === a.id)?.genre || '' }))
    );

    // Filtered suggestions berdasarkan pencarian
    const filteredArtists = artistSearch.trim()
        ? artists.filter(
            (a) =>
                a.name.toLowerCase().includes(artistSearch.toLowerCase()) &&
                !selectedArtists.find((s) => s.id === a.id)
        )
        : [];

    function addArtist(artist) {
        const newSelected = [...selectedArtists, artist];
        setSelectedArtists(newSelected);
        setData("artist_ids", newSelected.map((a) => a.id.toString()));
        setArtistSearch("");
        setShowSuggestions(false);
    }

    function removeArtist(artistId) {
        const newSelected = selectedArtists.filter((a) => a.id !== artistId);
        setSelectedArtists(newSelected);
        setData("artist_ids", newSelected.map((a) => a.id.toString()));
    }

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                artistInputRef.current && !artistInputRef.current.contains(e.target) &&
                suggestionsRef.current && !suggestionsRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // --------------------------

    function handleFile(e) {
        const file = e.target.files[0];
        if (file) {
            setData("banner", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
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
        post(`/admin/layanan-konser/${concert.id}`);
    }

    return (
        <AdminLayout title="Edit Konser">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <a
                        href="/admin/layanan-konser"
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
                            Edit Konser
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Perbarui informasi dan tiket konser.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.75fr_1.1fr] gap-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <form onSubmit={submitForm}>
                            <div className="p-6 sm:p-8 space-y-8">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                JUDUL KONSER{" "}
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
                                                className={`w-full px-4 py-2.5 border ${errors.title ? "border-red-400" : "border-gray-200"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50`}
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                GAMBAR BANNER{" "}
                                                <span className="text-gray-400 font-normal lowercase">
                                                    (opsional, biarkan kosong
                                                    jika tidak ingin mengubah)
                                                </span>
                                            </label>
                                            {previewUrl && (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-40 h-24 object-cover rounded-xl border border-gray-200 mb-3 shadow-sm"
                                                    onError={() =>
                                                        setPreviewUrl("")
                                                    }
                                                />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleFile}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                            />
                                            {errors.banner && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.banner}
                                                </p>
                                            )}
                                        </div>
                                        {/* VENUE SEARCH — Nominatim API */}
                                        <div className="col-span-2">
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                CARI / UBAH LOKASI VENUE
                                            </label>
                                            <VenueSearchPicker
                                                initialLat={data.latitude}
                                                initialLng={data.longitude}
                                                initialVenueName={data.venue_name}
                                                onSelect={(result) => {
                                                    setData(prev => ({
                                                        ...prev,
                                                        venue_name: result.venueName || prev.venue_name,
                                                        city: result.city || prev.city,
                                                        latitude: result.lat ? result.lat.toString() : prev.latitude,
                                                        longitude: result.lng ? result.lng.toString() : prev.longitude,
                                                    }));
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                NAMA VENUE{" "}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.venue_name}
                                                onChange={(e) => setData("venue_name", e.target.value)}
                                                className={`w-full px-4 py-2.5 border ${errors.venue_name ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50/50`}
                                                placeholder="Nama venue"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                KOTA{" "}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => setData("city", e.target.value)}
                                                className={`w-full px-4 py-2.5 border ${errors.city ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50/50`}
                                                placeholder="Kota"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                TANGGAL ACARA{" "}
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
                                                className={`w-full px-4 py-2.5 border ${errors.event_date ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50/50`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                WAKTU MULAI{" "}
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
                                                className={`w-full px-4 py-2.5 border ${errors.event_time ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50/50`}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                DESKRIPSI <span className="text-gray-400 font-normal lowercase">(opsional)</span>
                                            </label>
                                            <textarea
                                                rows="5"
                                                value={data.description || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            ></textarea>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                STATUS{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData("status", e.target.value)}
                                                className={`w-full px-4 py-3 border ${errors.status ? "border-red-400" : "border-gray-200"} rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                                            >
                                                <option value="" disabled>-- Pilih Status --</option>
                                                <option value="active">Aktif / Publik</option>
                                                <option value="draft">Draft</option>
                                                <option value="completed">Selesai</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Artis Tampil */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-3">ARTIS TAMPIL <span className="text-red-500">*</span></h3>

                                    {/* Tag artis terpilih */}
                                    {selectedArtists.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {selectedArtists.map((artist) => (
                                                <span
                                                    key={artist.id}
                                                    className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full"
                                                >
                                                    {artist.name}
                                                    {artist.genre && (
                                                        <span className="text-blue-400 font-normal">({artist.genre})</span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArtist(artist.id)}
                                                        className="ml-1 text-blue-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Input pencarian artis */}
                                    <div className="relative">
                                        <div
                                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                                        >
                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                ref={artistInputRef}
                                                type="text"
                                                value={artistSearch}
                                                onChange={(e) => {
                                                    setArtistSearch(e.target.value);
                                                    setShowSuggestions(true);
                                                }}
                                                onFocus={() => setShowSuggestions(true)}
                                                placeholder="Cari dan pilih artis..."
                                                className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm text-gray-800 placeholder-gray-400"
                                            />
                                        </div>

                                        {/* Dropdown sugesti */}
                                        {showSuggestions && filteredArtists.length > 0 && (
                                            <div
                                                ref={suggestionsRef}
                                                className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                                            >
                                                {filteredArtists.slice(0, 8).map((artist) => (
                                                    <button
                                                        key={artist.id}
                                                        type="button"
                                                        onClick={() => addArtist(artist)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">{artist.name}</p>
                                                            {artist.genre && (
                                                                <p className="text-xs text-gray-400">{artist.genre}</p>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Pesan ketika ketik tapi tidak ada hasil */}
                                        {showSuggestions && artistSearch.trim() && filteredArtists.length === 0 && (
                                            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-500">
                                                Tidak ada artis ditemukan untuk "{artistSearch}"
                                            </div>
                                        )}
                                    </div>
                                    {errors.artist_ids && (
                                        <p className="mt-2 text-xs font-semibold text-red-500">
                                            {errors.artist_ids}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
                                        <h3 className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide">
                                            KATEGORI TIKET{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addCategory}
                                            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 shadow-sm"
                                        >
                                            + Tambah Kategori
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {data.ticket_categories.map(
                                            (cat, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-gray-50/50 p-5 rounded-2xl border border-gray-200"
                                                >
                                                    <div className="w-full sm:w-1/3">
                                                        <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
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
                                                    <div className="w-full sm:w-1/3">
                                                        <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
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
                                                    <div className="w-full sm:w-1/3">
                                                        <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                                                            Total Kuota
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
                                                            className="mt-2 sm:mt-0 text-red-500 hover:text-white bg-white hover:bg-red-500 p-2.5 rounded-xl border border-red-200 hover:border-red-500 transition-colors shadow-sm"
                                                            title="Hapus Kategori"
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
                                        <p className="mt-2 text-xs text-red-500 font-medium">
                                            {errors.ticket_categories}
                                        </p>
                                    )}
                                    <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-3 text-sm text-yellow-800">
                                        <svg
                                            className="w-5 h-5 flex-shrink-0 text-yellow-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p>
                                            Jika Anda mengubah kuota total,
                                            pastikan nilainya tidak lebih kecil
                                            dari tiket yang sudah terjual.
                                            Kategori yang sudah memiliki
                                            transaksi tidak akan terhapus
                                            meskipun Anda menghapusnya dari form
                                            ini.
                                        </p>
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
                                    href="/admin/layanan-konser"
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
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    Banner Saat Ini
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Preview gambar banner konser
                                </p>
                            </div>
                        </div>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Banner saat ini"
                                className="w-full h-[240px] object-cover rounded-3xl border border-gray-200 shadow-sm"
                                onError={() => setPreviewUrl("")}
                            />
                        ) : (
                            <div className="w-full h-[240px] rounded-3xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                Tidak ada banner
                            </div>
                        )}
                        <div className="mt-6 space-y-4 text-sm text-gray-600">
                            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                                <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">
                                    Info
                                </p>
                                <p className="mt-2">
                                    Upload gambar baru akan menggantikan banner
                                    lama secara otomatis.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                                    Detail Konser
                                </p>
                                <p className="mt-2 text-sm text-slate-700 font-medium">
                                    {concert.title}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {concert.venue_name}, {concert.city}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AdminLayout>
    );
}
