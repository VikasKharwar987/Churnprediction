import { Link } from "react-router-dom";
import landingImage from "../images/landingpage.png";


function Landing() {
    return (
        <div className="min-h-screen bg-white text-gray-800">

            {/* ================= NAVBAR ================= */}
            <nav className="flex justify-between items-center px-12 py-6 border-b bg-white sticky top-0 z-50">
                <h1 className="text-2xl font-semibold tracking-wide">
                    ChurnSense
                </h1>
                <div className="space-x-6">
                    <Link to="/login" className="hover:text-black">
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            {/* ================= HERO SECTION ================= */}
            <section className="px-12 py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <h2 className="text-5xl font-bold mb-8 leading-tight">
                            Intelligent Customer Churn Prediction
                            for Telecom & Subscription Businesses
                        </h2>

                        <p className="text-lg text-gray-600 mb-10">
                            ChurnSense helps telecom analysts, customer retention teams,
                            and subscription-based businesses identify high-risk customers
                            before they leave — using machine learning-driven insights.
                        </p>

                        <div className="space-x-6">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800"
                            >
                                Get Started
                            </Link>

                            <Link
                                to="/login"
                                className="px-8 py-3 border border-black rounded-md hover:bg-gray-100"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    <div>
                        {/* Replace with your own image */}
                        <div className="relative w-full h-[420px] overflow-hidden rounded-xl shadow-lg">

                            <img
                                src={landingImage}
                                alt="Dashboard Preview"
                                className="w-full h-full object-cover object-top translate-y-[-20px]"
                            />

                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>

                        </div>

                    </div>

                </div>
            </section>

            {/* ================= WHO IS THIS FOR ================= */}
            <section className="px-12 py-20">
                <div className="max-w-6xl mx-auto text-center">

                    <h3 className="text-3xl font-semibold mb-12">
                        Who Is ChurnSense Designed For?
                    </h3>

                    <div className="grid md:grid-cols-3 gap-10">

                        <div className="p-8 border rounded-lg">
                            <h4 className="text-xl font-semibold mb-4">
                                Telecom Analysts
                            </h4>
                            <p className="text-gray-600">
                                Predict customer churn using structured telecom usage data,
                                contract types, and service behavior metrics.
                            </p>
                        </div>

                        <div className="p-8 border rounded-lg">
                            <h4 className="text-xl font-semibold mb-4">
                                Retention Teams
                            </h4>
                            <p className="text-gray-600">
                                Identify high-risk customers and take proactive retention
                                measures before contract termination.
                            </p>
                        </div>

                        <div className="p-8 border rounded-lg">
                            <h4 className="text-xl font-semibold mb-4">
                                Subscription Businesses
                            </h4>
                            <p className="text-gray-600">
                                Reduce churn across SaaS, OTT, broadband, and recurring
                                payment-based platforms.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="px-12 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto">

                    <h3 className="text-3xl font-semibold text-center mb-16">
                        How It Works
                    </h3>

                    <div className="grid md:grid-cols-3 gap-12 text-center">

                        <div>
                            <div className="text-5xl font-bold mb-4">1</div>
                            <h4 className="text-xl font-semibold mb-3">
                                Upload Customer Data
                            </h4>
                            <p className="text-gray-600">
                                Upload a CSV file containing telecom customer attributes
                                such as tenure, monthly charges, contract type,
                                internet service, and billing details.
                            </p>
                        </div>

                        <div>
                            <div className="text-5xl font-bold mb-4">2</div>
                            <h4 className="text-xl font-semibold mb-3">
                                ML-Based Risk Scoring
                            </h4>
                            <p className="text-gray-600">
                                Our machine learning model analyzes patterns and
                                assigns churn probability with risk classification
                                (Low, Medium, High).
                            </p>
                        </div>

                        <div>
                            <div className="text-5xl font-bold mb-4">3</div>
                            <h4 className="text-xl font-semibold mb-3">
                                Visual Analytics Dashboard
                            </h4>
                            <p className="text-gray-600">
                                View interactive charts and analytics to prioritize
                                high-risk customers and improve retention strategy.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* ================= SAMPLE DATA FORMAT ================= */}
            <section className="px-12 py-20">
                <div className="max-w-6xl mx-auto">

                    <h3 className="text-3xl font-semibold text-center mb-12">
                        Required Data Format
                    </h3>

                    <p className="text-center text-gray-600 mb-10">
                        The system expects telecom customer-level data including:
                    </p>

                    <div className="grid md:grid-cols-2 gap-12">

                        <ul className="space-y-3 text-gray-700">
                            <li>• Gender</li>
                            <li>• Senior Citizen Status</li>
                            <li>• Partner / Dependents</li>
                            <li>• Tenure</li>
                            <li>• Internet Service Type</li>
                            <li>• Contract Type</li>
                            <li>• Monthly Charges</li>
                            <li>• Total Charges</li>
                        </ul>

                        <div>
                            {/* Replace with dataset preview image */}
                            {/* <img src="/images/sample-csv-preview.png" alt="CSV Format Preview" /> */}
                        </div>

                    </div>

                </div>
            </section>

            {/* ================= SECURITY ================= */}
            <section className="px-12 py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">

                    <h3 className="text-3xl font-semibold mb-6">
                        Secure & Multi-Tenant Architecture
                    </h3>

                    <p className="text-gray-600">
                        Each organization’s data is isolated through secure
                        JWT-based authentication and user-specific database
                        segmentation. Your data remains private and protected.
                    </p>

                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="px-12 py-10 border-t text-center text-gray-500">
                © {new Date().getFullYear()} ChurnSense. All rights reserved.
            </footer>

        </div>
    );
}

export default Landing;
