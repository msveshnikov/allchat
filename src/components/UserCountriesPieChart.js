import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography, Box } from "@mui/material";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
];

const UserCountriesPieChart = ({ usersByCountry }) => {
    const pieData = Object.entries(usersByCountry)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([country, count]) => ({ name: country, value: count }));

    const totalUsers = pieData.reduce((sum, entry) => sum + entry.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box sx={{ bgcolor: "background.paper", p: 2, border: "1px solid #ccc" }}>
                    <Typography variant="body2">{`${data.name}: ${data.value} users`}</Typography>
                    <Typography variant="body2">{`(${((data.value / totalUsers) * 100).toFixed(2)}%)`}</Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box sx={{ mt: 4, height: 400 }}>
            <Typography variant="h5" gutterBottom align="center" color="primary">
                Top 10 Countries by User Count
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default UserCountriesPieChart;
