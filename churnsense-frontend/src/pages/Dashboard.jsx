import { useEffect, useState } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

function Dashboard() {
    const [page, setPage] = useState(1);
    const limit = 5;

    const [analytics, setAnalytics] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("token");

    // 🔥 Fetch Analytics
    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "http://127.0.0.1:8000/analytics",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAnalytics(res.data);
        } catch (error) {
            console.error("Analytics error:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Fetch Customers
    const fetchCustomers = async () => {
        try {
            const skip = (page - 1) * limit;

            const res = await axios.get(
                `http://127.0.0.1:8000/customers?skip=${skip}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCustomers(res.data);
        } catch (error) {
            console.error("Customer fetch error:", error);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    // 🔥 Upload CSV
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);

            await axios.post(
                "http://127.0.0.1:8000/upload-csv",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            await fetchAnalytics();
            await fetchCustomers();

            alert("CSV uploaded and scored successfully!");
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const riskData = analytics
        ? [
            { name: "High", value: analytics.high_risk },
            { name: "Medium", value: analytics.medium_risk },
            { name: "Low", value: analytics.low_risk },
        ]
        : [];

    const COLORS = ["#ef4444", "#facc15", "#22c55e"];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">
                        ChurnSense Dashboard
                    </h1>


                    <div className="bg-white shadow px-4 py-2 rounded-lg">
                        {uploading ? (
                            <span className="text-sm text-blue-500">
                                Uploading...
                            </span>
                        ) : (
                            <input
                                type="file"
                                onChange={handleUpload}
                                className="text-sm"
                            />
                        )}
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/";
                            }}
                            className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>

                </div>

                {loading && (
                    <div className="mb-6 text-gray-500">
                        Loading dashboard...
                    </div>
                )}

                {/* Analytics Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <Card title="Total Customers" value={analytics.total_customers} />
                        <Card title="High Risk" value={analytics.high_risk} color="bg-red-500" />
                        <Card title="Medium Risk" value={analytics.medium_risk} color="bg-yellow-500" />
                        <Card title="Low Risk" value={analytics.low_risk} color="bg-green-500" />
                    </div>
                )}

                {/* Charts */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-lg font-semibold mb-6 text-gray-700">
                                Risk Distribution
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        label
                                    >
                                        {riskData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-lg font-semibold mb-6 text-gray-700">
                                Risk Count Overview
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={riskData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                )}

                {/* Customers Table */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-700">
                        Recent Customers
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-gray-600 text-sm">
                                    <th className="py-3">ID</th>
                                    <th className="py-3">Gender</th>
                                    <th className="py-3">Tenure</th>
                                    <th className="py-3">Probability</th>
                                    <th className="py-3">Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3">{c.id}</td>
                                        <td className="py-3">{c.gender}</td>
                                        <td className="py-3">{c.tenure}</td>
                                        <td className="py-3 font-medium">
                                            {c.churn_probability.toFixed(2)}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-white text-sm ${c.risk_category === "High"
                                                    ? "bg-red-500"
                                                    : c.risk_category === "Medium"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                    }`}
                                            >
                                                {c.risk_category}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Previous
                        </button>

                        <span className="text-gray-600">
                            Page {page}
                        </span>

                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

function Card({ title, value, color = "bg-blue-500" }) {
    return (
        <div className={`p-6 text-white rounded-lg shadow ${color}`}>
            <h3 className="text-sm">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

export default Dashboard;
