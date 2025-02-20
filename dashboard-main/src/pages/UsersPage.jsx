import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import React, { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";

const API_URL = "http://localhost:5000/api";

const UsersPage = () => {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        newUsersToday: 0,
        activeUsers: 0,
        churnRate: "0%"
    });

    const fetchAllUsers = async () => {
        try {
            let activeCount = 0;
            let currentPage = 1;
            const limit = 1000; // Daha büyük bir limit kullanarak sayfa sayısını azaltalım

            // İlk sayfayı çek ve toplam sayfa sayısını öğren
            const firstPageResponse = await axios.get(`${API_URL}/users?page=${currentPage}&limit=${limit}`);
            const { totalUsers, totalPages } = firstPageResponse.data;

            // İlk sayfadaki aktif kullanıcıları say
            activeCount += firstPageResponse.data.empData.filter(user => user.status === "active").length;

            // Diğer sayfaları çek ve aktif kullanıcıları say
            for (let page = 2; page <= totalPages; page++) {
                const response = await axios.get(`${API_URL}/users?page=${page}&limit=${limit}`);
                activeCount += response.data.empData.filter(user => user.status === "active").length;
            }

            // İstatistikleri güncelle
            setUserStats({
                totalUsers,
                activeUsers: activeCount,
                newUsersToday: Math.floor(totalUsers * 0.002), // Örnek hesaplama
                churnRate: ((totalUsers - activeCount) / totalUsers * 100).toFixed(1) + "%"
            });

        } catch (error) {
            console.error("Error fetching user stats:", error);
            toast.error("Failed to fetch user statistics");
        }
    };

    useEffect(() => {
        fetchAllUsers();
        const interval = setInterval(fetchAllUsers, 30000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Users" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {/* STATS */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name="Total Users"
                        icon={UsersIcon}
                        value={userStats.totalUsers.toLocaleString()}
                        color="#6366F1"
                    />
                    <StatCard 
                        name="New Users Today" 
                        icon={UserPlus} 
                        value={userStats.newUsersToday} 
                        color="#10B981" 
                    />
                    <StatCard
                        name="Active Users"
                        icon={UserCheck}
                        value={userStats.activeUsers.toLocaleString()}
                        color="#F59E0B"
                    />
                    <StatCard 
                        name="Churn Rate" 
                        icon={UserX} 
                        value={userStats.churnRate} 
                        color="#EF4444" 
                    />
                </motion.div>

                <UsersTable />

                {/* USER CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <UserGrowthChart />
                    <UserActivityHeatmap />
                    <UserDemographicsChart />
                </div>
            </main>
            <ToastContainer />
        </div>
    );
};

export default UsersPage;