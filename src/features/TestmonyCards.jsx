import React, { useEffect, useState } from "react";
import { Star, Trash2, Calendar, MessageCircle } from "lucide-react";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";

const TestmonyCards = () => {
    const [testmonies, setTestmonies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(API_ENDPOINTS.TESTIMONIALS.OWNER_LIST)
            .then((res) => {
                setTestmonies(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const removeCard = async (id) => {
        if (!window.confirm("Supprimer ce témoignage ?")) return;

        try {
            await api.delete(API_ENDPOINTS.TESTIMONIALS.DELETE(id));
            setTestmonies((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5 text-muted">
                Chargement...
            </div>
        );
    }

    return (
        <div className="container py-2 px-4 mb-[12dvh]">

            <div className="row g-2">

                {testmonies.map((item) => (
                    <div className="relative col-md-6 col-lg-4" key={item.id}>
                        <div
                            className="testimonial-card shadow-sm h-auto"
                        >

                            {/* HEADER */}
                            <div className="d-flex align-items-center justify-content-between mb-3">

                                <div className="d-flex align-items-center">
                                    <img
                                        src={item.client.image || item.client.photo_url}
                                        alt=""
                                        className="avatar"
                                    />

                                    <div className="ms-3">
                                        <h6 className="mb-0 fw-bold">
                                            {item.client.prenom} {item.client.nom}
                                        </h6>

                                        <small className="flex items-center text-muted d-flex align-items-center gap-1">
                                            <Calendar size={13} />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>

                                <button
                                    className="absolute top-3 right-5 bg-black-200 text-black-300 btn-delete"
                                    onClick={() => removeCard(item.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* STARS */}
                            <div className="px-3 stars mb-3">
                                {[...Array(item.number_stars)].map((_, i) => (
                                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                                ))}
                            </div>

                            {/* CONTENT */}
                            <div className="content-box">
                                <MessageCircle size={18} className="icon" />
                                <p className="mb-0">{item.content}</p>
                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* STYLE */}
            <style jsx>{`
                .testimonial-card {
                    background: #ffffff;
                    border-radius: 18px;
                    padding: 18px;
                    transition: all 0.25s ease;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .testimonial-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                }

                .avatar {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #f3f4f6;
                }

                .btn-delete {
                    background: transparent;
                    border: none;
                    color: #ef4444;
                    padding: 6px;
                    border-radius: 8px;
                    transition: 0.2s;
                }

                .btn-delete:hover {
                    background: rgba(239, 68, 68, 0.1);
                    transform: scale(1.05);
                }

                .stars {
                    display: flex;
                    gap: 2px;
                }

                .content-box {
                    background: #f9fafb;
                    border-radius: 14px;
                    padding: 14px;
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }

                .content-box .icon {
                    color: #6366f1;
                    margin-top: 2px;
                }

                p {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #374151;
                }
            `}</style>
        </div>
    );
};

export default TestmonyCards;