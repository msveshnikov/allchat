import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CountUp from "react-countup";

const CoinBalance = ({ coins, onClick }) => {
    const [prevCoins, setPrevCoins] = useState(0);

    useEffect(() => {
        setPrevCoins(coins);
    }, [coins]);

    return (
        <Box position="relative" display="inline-flex" alignItems="center" style={{ cursor: "pointer" }}>
            <img src="/gold-coin.png" alt="Gold Coin" style={{ width: "46px", height: "46px" }} />
            <Box
                position="absolute"
                onClick={onClick}
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textShadow: "-1px -1px 0 #00f, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
            >
                <CountUp start={prevCoins} end={coins} duration={1.5} separator="," />
            </Box>
        </Box>
    );
};

export default CoinBalance;
