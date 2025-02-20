import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from 'react-toastify';

// API URL'ini tanımlayalım
const API_URL = "http://localhost:5000/api/sales/by-category";

// Renk paletini tanımlayalım
const COLORS = [
    "#8884d8", // Mor
    "#82ca9d", // Yeşil
    "#ffc658", // Sarı
    "#ff8042", // Turuncu
    "#0088FE", // Mavi
    "#00C49F", // Turkuaz
    "#FFBB28", // Altın
    "#FF8042", // Mercan
    "#EA4C89", // Pembe
    "#0052CC"  // Koyu Mavi
];

const SalesByCategoryChart = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (response.ok) {
                setSalesData(data.data);
                setError(null);
            } else {
                console.error('API Hatası:', data.message);
                setError(data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            setError('Veriler yüklenirken bir hata oluştu');
            toast.error('Veriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <motion.div 
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Veriler yükleniyor...</div>
                </div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div 
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-400">{error}</div>
                </div>
            </motion.div>
        );
    }

    // Veri kontrolü
    if (!Array.isArray(salesData) || salesData.length === 0) {
        return (
            <motion.div 
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Henüz satış verisi bulunmuyor.</div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Kategorilere Göre Satışlar</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={salesData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="category"
                            label={({ name, percent }) => 
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {salesData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: "rgba(31, 41, 55, 0.8)", 
                                borderColor: "#4B5563" 
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => `₺${value.toLocaleString()}`}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default SalesByCategoryChart;