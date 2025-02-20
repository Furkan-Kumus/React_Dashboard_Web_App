import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";

// API URL'ini tanımlayalım
const API_URL = "http://localhost:5000/api/sales/stats";

const SalesPage = () => {
    const [salesStats, setSalesStats] = useState({
        totalRevenue: "$0.00",
        averageOrderValue: "$0.00",
        conversionRate: "0%",
        salesGrowth: "0%"
    });

    useEffect(() => {
        // API çağrısı yaparak verileri al
        const fetchSalesStats = async () => {
            try {
                const response = await fetch(API_URL);  // API_URL burada doğru şekilde kullanıldı
                const data = await response.json();
                
                if (response.ok && data.success) {  // Başarılı bir yanıt kontrolü
                    setSalesStats({
                        totalRevenue: data.data.totalRevenue,
                        averageOrderValue: data.data.averageOrderValue,
                        conversionRate: data.data.conversionRate,
                        salesGrowth: data.data.salesGrowth
                    });
                } else {
                    console.error("API Hatası:", data.message);
                }
            } catch (error) {
                console.error("Error fetching sales stats:", error);
            }
        };

        fetchSalesStats();
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Sales Dashboard' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* SALES STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Revenue' icon={DollarSign} value={salesStats.totalRevenue} color='#6366F1' />
                    <StatCard
                        name='Avg. Order Value'
                        icon={ShoppingCart}
                        value={salesStats.averageOrderValue}
                        color='#10B981'
                    />
                    <StatCard
                        name='Conversion Rate'
                        icon={TrendingUp}
                        value={salesStats.conversionRate}
                        color='#F59E0B'
                    />
                    <StatCard name='Sales Growth' icon={CreditCard} value={salesStats.salesGrowth} color='#EF4444' />
                </motion.div>

                <SalesOverviewChart />

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                    <SalesByCategoryChart />
                    <DailySalesTrend />
                </div>
            </main>
        </div>
    );
};

export default SalesPage;
