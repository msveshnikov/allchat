import cluster from "cluster";
import express from "express";
import promBundle from "express-prom-bundle";

const MAX_CPU = 4;

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < MAX_CPU; i++) {
        cluster.fork();
    }
    const metricsApp = express();
    metricsApp.use("/metrics", promBundle.clusterMetrics());
    metricsApp.listen(6002);
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    import("./index.js");
}
