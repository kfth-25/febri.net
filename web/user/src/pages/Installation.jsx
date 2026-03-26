import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Button,
    TextField,
    MenuItem,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import WifiIcon from '@mui/icons-material/Wifi';
import PlaceIcon from '@mui/icons-material/Place';
import Layout from '../components/Layout';
import { createSubscription } from '../services/subscriptionService';
import { getPackages } from '../services/packageService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const techniciansData = [
    {
        id: 1,
        name: 'Budi Santoso',
        role: 'Senior Fiber Technician',
        status: 'available',
        area: 'Jakarta Barat & Pusat',
        phone: '+62 812-3456-7890'
    },
    {
        id: 2,
        name: 'Siti Nurhaliza',
        role: 'Network Engineer',
        status: 'busy',
        area: 'Jakarta Selatan',
        phone: '+62 813-9876-5432'
    },
    {
        id: 3,
        name: 'Ahmad Wijaya',
        role: 'Field Technician',
        status: 'available',
        area: 'Jakarta Timur',
        phone: '+62 815-1234-5678'
    }
];

const defaultCenter = {
    lat: -6.914744,
    lng: 107.60981
};

const mapMarkerIcon = L.divIcon({
    className: '',
    html: '<div style="position:relative;width:44px;height:52px;display:flex;align-items:center;justify-content:center;"><div style="width:32px;height:32px;border-radius:999px;background:linear-gradient(135deg,#00e5ff,#2979ff);box-shadow:0 12px 28px rgba(15,23,42,0.4);display:flex;align-items:center;justify-content:center;border:2px solid #ffffff;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d=\"M12 17.5c-.85 0-1.55.7-1.55 1.55 0 .85.7 1.55 1.55 1.55.85 0 1.55-.7 1.55-1.55 0-.85-.7-1.55-1.55-1.55z\" fill=\"#ffffff\"/><path d=\"M9.5 15c.7-.7 1.5-1.1 2.5-1.1s1.8.4 2.5 1.1\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M8 12.5c1.1-1.1 2.5-1.7 4-1.7s2.9.6 4 1.7\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M6.5 10c1.5-1.5 3.5-2.3 5.5-2.3s4 .8 5.5 2.3\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/></svg></div><div style="position:absolute;bottom:4px;width:14px;height:14px;border-radius:999px;background:rgba(0,229,255,0.9);box-shadow:0 4px 10px rgba(15,23,42,0.35);\"></div></div>',
    iconSize: [44, 52],
    iconAnchor: [22, 52]
});

const ClickMarker = ({ position, onChange }) => {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const next = { lat, lng };
            onChange(next, map);
        }
    });

    useEffect(() => {
        if (position) {
            map.setView([position.lat, position.lng], 17);
        }
    }, [position, map]);

    return position ? <Marker position={[position.lat, position.lng]} icon={mapMarkerIcon} /> : null;
};

const parseLatLngFromGoogleMaps = (value) => {
    if (!value) return null;
    const trimmed = value.trim();

    let source = trimmed;

    const iframeMatch = trimmed.match(/src="([^"]+)"/);
    if (iframeMatch && iframeMatch[1]) {
        source = iframeMatch[1];
    }

    try {
        const url = source.startsWith('http') ? new URL(source) : new URL(`https://www.google.com/maps/${source}`);

        const atIndex = url.pathname.indexOf('@');
        if (atIndex !== -1) {
            const afterAt = url.pathname.slice(atIndex + 1);
            const parts = afterAt.split(',');
            if (parts.length >= 2) {
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                    return { lat, lng };
                }
            }
        }

        const q = url.searchParams.get('q');
        if (q) {
            const match = q.match(/(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);
            if (match) {
                return { lat: parseFloat(match[1]), lng: parseFloat(match[3]) };
            }
        }
    } catch {
    }

    const pbMatch = trimmed.match(/!3d(-?\d+(\.\d+)?)!4d(-?\d+(\.\d+)?)/);
    if (pbMatch) {
        return { lat: parseFloat(pbMatch[1]), lng: parseFloat(pbMatch[3]) };
    }

    const genericMatch = trimmed.match(/(-?\d+(\.\d+)?)[ ,]+(-?\d+(\.\d+)?)/);
    if (genericMatch) {
        return { lat: parseFloat(genericMatch[1]), lng: parseFloat(genericMatch[3]) };
    }

    return null;
};

const Installation = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        wifiPackageId: '',
        installationAddress: '',
        preferredSchedule: '',
        notes: '',
        technicianName: ''
    });
    const [mapUrl, setMapUrl] = useState('');
    const [packages, setPackages] = useState([]);
    const [packagesLoading, setPackagesLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [installRequest, setInstallRequest] = useState(null);
    const [mapPosition, setMapPosition] = useState(defaultCenter);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPackages();
                setPackages(data);
            } catch (error) {
                setPackages([]);
            } finally {
                setPackagesLoading(false);
            }
        };

        fetchPackages();
    }, []);

    useEffect(() => {
        let preselected = null;
        try {
            const preselectedRaw = localStorage.getItem('preselected_technician');
            if (preselectedRaw) {
                preselected = JSON.parse(preselectedRaw);
                setSelectedTechnician(preselected);
            }
        } catch {
            preselected = null;
        }

        if (!user) {
            setConfirmation(null);
            if (!preselected) {
                setSelectedTechnician(null);
            }
            return;
        }

        const stored = localStorage.getItem('last_installation_confirmation');
        if (!stored) {
            setConfirmation(null);
            if (!preselected) {
                setSelectedTechnician(null);
            }
            return;
        }

        try {
            const parsed = JSON.parse(stored);
            if (parsed.userId && user.id && parsed.userId !== user.id) {
                setConfirmation(null);
                if (!preselected) {
                    setSelectedTechnician(null);
                }
                return;
            }
            if (!parsed.userId && parsed.userEmail && user.email && parsed.userEmail !== user.email) {
                setConfirmation(null);
                if (!preselected) {
                    setSelectedTechnician(null);
                }
                return;
            }
            setConfirmation(parsed);
            if (!preselected) {
                if (parsed.technician) {
                    setSelectedTechnician(parsed.technician);
                } else {
                    setSelectedTechnician(null);
                }
            }
        } catch {
            setConfirmation(null);
            if (!preselected) {
                setSelectedTechnician(null);
            }
        }
    }, [user]);

    useEffect(() => {
        const parsed = parseLatLngFromGoogleMaps(mapUrl);
        if (parsed) {
            setMapPosition(parsed);
        }
    }, [mapUrl]);

    useEffect(() => {
        const raw = localStorage.getItem('installation_requests');
        if (!raw) return;
        try {
            const list = JSON.parse(raw);
            if (!Array.isArray(list) || list.length === 0) return;

            let candidate = null;

            if (user) {
                const filtered = list.filter((item) => {
                    if (item.userId && user.id && item.userId === user.id) {
                        return true;
                    }
                    if (!item.userId && item.userEmail && user.email && item.userEmail === user.email) {
                        return true;
                    }
                    return false;
                });

                if (filtered.length > 0) {
                    candidate = filtered[filtered.length - 1];
                } else {
                    const anyTagged = list.some((item) => item.userId || item.userEmail);
                    if (!anyTagged) {
                        candidate = list[list.length - 1];
                    }
                }
            } else {
                candidate = list[list.length - 1];
            }

            if (candidate) {
                setInstallRequest(candidate);
            }
        } catch {
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setConfirmation(null);

        if (!formData.fullName || !formData.phone || !formData.installationAddress) {
            setErrorMessage('Nama, nomor HP/WA, dan alamat pemasangan wajib diisi.');
            return;
        }

        if (!formData.wifiPackageId) {
            setErrorMessage('Silakan pilih paket WiFi yang Diinginkan.');
            return;
        }

        if (formData.email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.email)) {
                setErrorMessage('Format email tidak valid.');
                return;
            }
        }

        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 8) {
            setErrorMessage('Nomor HP/WA tidak valid. Minimal 8 digit angka.');
            return;
        }

        if (!mapUrl || !parseLatLngFromGoogleMaps(mapUrl)) {
            setErrorMessage('Lokasi pemasangan wajib diisi dengan URL Google Maps yang benar atau dengan menandai titik pada peta.');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                wifi_package_id: formData.wifiPackageId,
                installation_address: formData.installationAddress,
                full_name: formData.fullName,
                phone: formData.phone,
                email: formData.email || '',
                notes: [
                    `Nama: ${formData.fullName}`,
                    `HP/WA: ${formData.phone}`,
                    `Email: ${formData.email || '-'}`,
                    `Jadwal: ${formData.preferredSchedule || '-'}`,
                    `Catatan: ${formData.notes || '-'}`,
                    `Teknisi preferensi: ${formData.technicianName || '-'}`,
                    `Maps: ${mapUrl || '-'}`
                ].join(' | '),
                userId: user ? user.id : null,
                userEmail: user ? user.email : formData.email || null
            };

            const result = await createSubscription(payload);

            const selectedPackage = packages.find(
                (pkg) => String(pkg.id) === String(formData.wifiPackageId)
            );

            const generateRegistrationCode = () => {
                const now = new Date();
                const datePart = [
                    now.getFullYear(),
                    String(now.getMonth() + 1).padStart(2, '0'),
                    String(now.getDate()).padStart(2, '0')
                ].join('');
                const randomPart = Math.floor(Math.random() * 9000) + 1000;
                return `REG-${datePart}-${randomPart}`;
            };

            const registrationId =
                (result && (result.registration_code || result.registration_id || result.id)) ||
                generateRegistrationCode();

            const confirmationData = {
                registrationId,
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email || '-',
                packageName: selectedPackage ? selectedPackage.name : '-',
                packageSpeed: selectedPackage ? selectedPackage.speed : '-',
                address: formData.installationAddress,
                userId: user ? user.id : null,
                userEmail: user ? user.email : formData.email || null
            };

            try {
                const listRaw = localStorage.getItem('installation_requests');
                if (listRaw && selectedTechnician) {
                    const list = JSON.parse(listRaw);
                    if (Array.isArray(list) && list.length > 0) {
                        const updated = [...list];
                        let targetIndex = updated.length - 1;
                        if (user) {
                            for (let i = updated.length - 1; i >= 0; i -= 1) {
                                const item = updated[i];
                                if (item.userId && user.id && item.userId === user.id) {
                                    targetIndex = i;
                                    break;
                                }
                                if (!item.userId && item.userEmail && user.email && item.userEmail === user.email) {
                                    targetIndex = i;
                                    break;
                                }
                            }
                        }
                        if (targetIndex >= 0) {
                            updated[targetIndex] = {
                                ...updated[targetIndex],
                                technician: {
                                    id: selectedTechnician.id,
                                    name: selectedTechnician.name,
                                    phone: selectedTechnician.phone
                                }
                            };
                            localStorage.setItem('installation_requests', JSON.stringify(updated));
                            confirmationData.technician = {
                                id: selectedTechnician.id,
                                name: selectedTechnician.name,
                                phone: selectedTechnician.phone
                            };
                        }
                    }
                }
            } catch {
            }

            setConfirmation(confirmationData);
            localStorage.setItem('last_installation_confirmation', JSON.stringify(confirmationData));

            try {
                localStorage.removeItem('preselected_technician');
            } catch {
            }

            setFormData({
                fullName: '',
                phone: '',
                email: '',
                wifiPackageId: '',
                installationAddress: '',
                preferredSchedule: '',
                notes: '',
                technicianName: ''
            });

            if (selectedTechnician) {
                navigate('/billing');
            } else {
                navigate('/technicians');
            }
        } catch (error) {
            console.error('Failed to submit installation request:', error);
            setErrorMessage('Gagal mengirim permohonan. Silakan coba lagi atau hubungi admin.');
        } finally {
            setSubmitting(false);
        }
    };

    const coordinates = parseLatLngFromGoogleMaps(mapUrl);

    const getEmbedUrlFromCoordinates = () => {
        if (!coordinates) return '';
        const lat = coordinates.lat.toFixed(6);
        const lng = coordinates.lng.toFixed(6);
        return `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    };

    const handleSelectTechnician = (tech) => {
        setSelectedTechnician(tech);

        try {
            const raw = localStorage.getItem('installation_requests');
            if (raw && user) {
                const list = JSON.parse(raw);
                if (Array.isArray(list) && list.length > 0) {
                    const updated = [...list];
                    let targetIndex = updated.length - 1;
                    for (let i = updated.length - 1; i >= 0; i -= 1) {
                        const item = updated[i];
                        if (item.userId && user.id && item.userId === user.id) {
                            targetIndex = i;
                            break;
                        }
                        if (!item.userId && item.userEmail && user.email && item.userEmail === user.email) {
                            targetIndex = i;
                            break;
                        }
                    }
                    if (targetIndex >= 0) {
                        updated[targetIndex] = {
                            ...updated[targetIndex],
                            technician: {
                                id: tech.id,
                                name: tech.name,
                                phone: tech.phone
                            }
                        };
                        localStorage.setItem('installation_requests', JSON.stringify(updated));
                    }
                }
            }
        } catch {
        }

        if (confirmation) {
            const updatedConfirmation = {
                ...confirmation,
                technician: {
                    id: tech.id,
                    name: tech.name,
                    phone: tech.phone
                }
            };
            setConfirmation(updatedConfirmation);
            localStorage.setItem('last_installation_confirmation', JSON.stringify(updatedConfirmation));
        }
    };

    return (
        <Layout>
            <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, bgcolor: 'background.default' }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="overline" color="secondary.main" fontWeight="bold" letterSpacing={2}>
                            {confirmation && confirmation.technician ? 'STATUS PEMASANGAN' : 'PENDAFTARAN'}
                        </Typography>
                        <Typography variant="h3" fontWeight="800" sx={{ mt: 1, mb: 1 }}>
                            {confirmation && confirmation.technician ? 'Ringkasan Pemasangan WiFi Anda' : 'Form Pemasangan WiFi Baru'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" maxWidth={600}>
                            {confirmation && confirmation.technician
                                ? 'Berikut ringkasan permohonan pemasangan, jadwal estimasi, dan teknisi yang akan menangani instalasi di alamat Anda.'
                                : 'Isi data berikut untuk mengajukan pemasangan WiFi. Kami akan memverifikasi ketersediaan jaringan dan menghubungi Anda.'}
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>
                            {!confirmation || !confirmation.technician ? (
                                <>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Box
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    p: 1,
                                                    borderRadius: '999px',
                                                    background: 'linear-gradient(135deg, #00e5ff, #00b0ff)',
                                                    color: 'common.white'
                                                }}
                                            >
                                                <WifiIcon fontSize="small" />
                                            </Box>
                                            <Box sx={{ ml: 1.5 }}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    Data Calon Pelanggan
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Pastikan kontak dan alamat terisi dengan benar.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {errorMessage && (
                                            <Box sx={{ mb: 2, color: '#b91c1c', fontSize: 14 }}>
                                                {errorMessage}
                                            </Box>
                                        )}
                                        {successMessage && (
                                            <Box sx={{ mb: 2, color: '#15803d', fontSize: 14 }}>
                                                {successMessage}
                                            </Box>
                                        )}

                                        <Box component="form" noValidate onSubmit={handleSubmit}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        label="Nama Lengkap"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        label="No. HP / WhatsApp"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        margin="normal"
                                                        fullWidth
                                                        label="Email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                <TextField
                                                    select
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    label="Paket WiFi yang Diinginkan"
                                                    value={formData.wifiPackageId}
                                                    onChange={(e) => setFormData({ ...formData, wifiPackageId: e.target.value })}
                                                    sx={{ mb: 2 }}
                                                    SelectProps={{ displayEmpty: true }}
                                                    disabled={packagesLoading || packages.length === 0}
                                                >
                                                    <MenuItem value="">
                                                        <em>
                                                            {packagesLoading
                                                                ? 'Memuat paket...'
                                                                : packages.length === 0
                                                                ? 'Belum ada paket tersedia'
                                                                : 'Pilih Paket WiFi...'}
                                                        </em>
                                                    </MenuItem>
                                                    {packages.map((pkg) => (
                                                        <MenuItem key={pkg.id} value={pkg.id}>
                                                            {pkg.name} - {pkg.speed} (Rp {pkg.price})
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        label="Alamat Lengkap Pemasangan"
                                                        multiline
                                                        rows={2}
                                                        value={formData.installationAddress}
                                                        onChange={(e) => setFormData({ ...formData, installationAddress: e.target.value })}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        margin="normal"
                                                        fullWidth
                                                        label="Jadwal / Waktu Preferensi"
                                                        placeholder="Contoh: Malam hari, Sabtu-Minggu"
                                                        value={formData.preferredSchedule}
                                                        onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value })}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        margin="normal"
                                                        fullWidth
                                                        label="Catatan Tambahan"
                                                        multiline
                                                        rows={2}
                                                        value={formData.notes}
                                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="secondary"
                                                        disabled={submitting}
                                                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                                    >
                                                        {submitting ? 'Mengirim...' : 'Kirim Permohonan'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Paper>
                                </>
                            ) : (
                                <Paper
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 1,
                                                borderRadius: '999px',
                                                background: 'linear-gradient(135deg, #00e5ff, #00b0ff)',
                                                color: 'common.white'
                                            }}
                                        >
                                            <WifiIcon fontSize="small" />
                                        </Box>
                                        <Box sx={{ ml: 1.5 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Ringkasan Pemasangan
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Detail pemasangan, jadwal estimasi, dan teknisi penanggung jawab.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {installRequest && (
                                        <Box sx={{ mb: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Nomor Permohonan
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        #{installRequest.id}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Nomor Registrasi
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {confirmation.registrationId}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tanggal Permohonan
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {new Date(installRequest.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Perkiraan Pemasangan Selesai
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {(() => {
                                                            const d = new Date(installRequest.created_at);
                                                            d.setDate(d.getDate() + 2);
                                                            return d.toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            });
                                                        })()}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Paket
                                            </Typography>
                                            <Typography variant="body1">
                                                {confirmation.packageName} ({confirmation.packageSpeed})
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Alamat Pemasangan
                                            </Typography>
                                            <Typography variant="body1">
                                                {confirmation.address}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {confirmation.technician && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Teknisi Penanggung Jawab
                                            </Typography>
                                            <Typography variant="body1">
                                                {confirmation.technician.name} • {confirmation.technician.phone}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 3 }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => navigate('/billing')}
                                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, mr: 2 }}
                                        >
                                            Lihat Tagihan
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => navigate('/installation-status')}
                                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                        >
                                            Lihat Status Pemasangan
                                        </Button>
                                    </Box>
                                </Paper>
                            )}

                            {confirmation && !confirmation.technician && (
                                <Paper
                                    sx={{
                                        mt: 3,
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: '#bbf7d0',
                                        background: '#f0fdf4'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                                        Pendaftaran Berhasil Dikirim
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Simpan detail berikut sebagai referensi saat menghubungi CS atau teknisi.
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Nomor Registrasi
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {confirmation.registrationId}
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Nama Calon Pelanggan
                                            </Typography>
                                            <Typography variant="body1">
                                                {confirmation.fullName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Kontak
                                            </Typography>
                                            <Typography variant="body1">
                                                {confirmation.phone} {confirmation.email !== '-' ? `• ${confirmation.email}` : ''}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Paket yang Diajukan
                                            </Typography>
                                            <Typography variant="body1">
                                                {confirmation.packageName} ({confirmation.packageSpeed})
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Alamat Pemasangan
                                            </Typography>
                                            <Typography variant="body1">
                                                {confirmation.address}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Langkah berikutnya:
                                    </Typography>
                                    {confirmation && confirmation.technician ? (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            1. Admin akan memverifikasi permohonan dan menjadwalkan teknisi {confirmation.technician.name}.
                                            <br />
                                            2. Cek tagihan pemasangan dan pembayaran melalui menu Tagihan.
                                            <br />
                                            3. Pantau progres pemasangan di halaman Status Pemasangan.
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            1. Pilih teknisi yang akan menangani pemasangan pada halaman berikutnya.
                                            <br />
                                            2. Admin akan memverifikasi ketersediaan jaringan di alamat Anda.
                                            <br />
                                            3. Anda akan menerima konfirmasi jadwal melalui WhatsApp / Email.
                                        </Typography>
                                    )}
                                    <Box sx={{ mt: 3 }}>
                                        {confirmation && confirmation.technician ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => navigate('/billing')}
                                                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, mr: 2 }}
                                                >
                                                    Lihat Tagihan
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => navigate('/installation-status')}
                                                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                                >
                                                    Lihat Status Pemasangan
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => navigate('/technicians')}
                                                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, mr: 2 }}
                                                >
                                                    Pilih Teknisi
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => navigate('/installation-status')}
                                                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                                >
                                                    Lihat Status Pemasangan
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Paper>
                            )}
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PlaceIcon sx={{ color: 'secondary.main', mr: 1 }} />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Lokasi Pemasangan (Google Maps)
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Anda bisa klik langsung pada peta untuk menandai lokasi pemasangan, atau tempel URL Google
                                    Maps di kolom di bawah. Titik pada peta dan URL akan saling mengikuti.
                                </Typography>
                                <TextField
                                    label="URL Google Maps"
                                    placeholder="https://www.google.com/maps/..."
                                    fullWidth
                                    size="small"
                                    value={mapUrl}
                                    onChange={(e) => setMapUrl(e.target.value)}
                                    sx={{ mb: 1.5 }}
                                />
                                <Box
                                    sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: 260
                                    }}
                                >
                                    <MapContainer
                                        center={[mapPosition.lat, mapPosition.lng]}
                                        zoom={13}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <ClickMarker
                                            position={mapPosition}
                                            onChange={(pos) => {
                                                setMapPosition(pos);
                                                const gmUrl = `https://www.google.com/maps?q=${pos.lat.toFixed(
                                                    6
                                                )},${pos.lng.toFixed(6)}`;
                                                setMapUrl(gmUrl);
                                            }}
                                        />
                                    </MapContainer>
                                </Box>

                                {coordinates ? (
                                    <Box
                                        sx={{
                                            mt: 0.5,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            width: '260px',
                                            height: '180px'
                                        }}
                                    >
                                        <Box
                                            component="iframe"
                                            title="Lokasi Pemasangan"
                                            src={getEmbedUrlFromCoordinates()}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                border: 0
                                            }}
                                            allowFullScreen
                                        />
                                    </Box>
                                ) : mapUrl ? (
                                    <Box
                                        sx={{
                                            mt: 1,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'grey.50',
                                            border: '1px dashed',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Peta tidak dapat ditampilkan langsung di dalam aplikasi. Klik tombol di bawah untuk
                                            membuka lokasi di Google Maps.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => window.open(mapUrl, '_blank', 'noopener,noreferrer')}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Buka di Google Maps
                                        </Button>
                                    </Box>
                                ) : null}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default Installation;
