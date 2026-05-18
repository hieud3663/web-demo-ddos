"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(45);
  const [activeConnections, setActiveConnections] = useState(124);
  const [serverStatus, setServerStatus] = useState<"ONLINE" | "DEGRADED" | "CRITICAL">("ONLINE");
  const [logs, setLogs] = useState<{ time: string; msg: string; type: "info" | "warn" | "error" }[]>([]);

  const addLog = (msg: string, type: "info" | "warn" | "error") => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, msg, type }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    // Initial boot sequence log
    addLog("System initialized. All services operational.", "info");
    addLog("Monitoring incoming traffic on port 80/443.", "info");

    const pingInterval = setInterval(async () => {
      const startTime = performance.now();
      try {
        const res = await fetch('/api/ping', { cache: 'no-store' });
        const latency = Math.round(performance.now() - startTime);

        if (res.ok) {
          // Normal behavior simulation with slight random jitter
          setCpuUsage(prev => Math.max(5, Math.min(100, prev + (Math.random() * 10 - 5))));
          setRamUsage(prev => Math.max(20, Math.min(100, prev + (Math.random() * 4 - 2))));
          
          if (latency > 1000) {
             setServerStatus("DEGRADED");
             if (Math.random() > 0.7) addLog(`High latency detected: ${latency}ms`, "warn");
             setActiveConnections(prev => prev + Math.floor(Math.random() * 500));
          } else if (latency > 5000) {
             setServerStatus("CRITICAL");
             addLog(`Critical latency: ${latency}ms. Possible attack in progress.`, "error");
             setCpuUsage(99);
             setActiveConnections(prev => prev + Math.floor(Math.random() * 5000));
          } else {
             setServerStatus("ONLINE");
             setActiveConnections(prev => Math.max(10, Math.min(500, prev + (Math.random() * 50 - 25))));
          }
        } else {
          setServerStatus("CRITICAL");
          addLog(`API error: ${res.status}`, "error");
        }
      } catch (error) {
        setServerStatus("CRITICAL");
        setCpuUsage(100);
        addLog("Connection timeout. Server unresponsive.", "error");
      }
    }, 2000);

    return () => clearInterval(pingInterval);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Telemetry</h1>
        <p className={styles.subtitle}>Target Application for DDoS Resistance Testing</p>
        <p className={styles.subtitle}>Đây là trang demo được xây dựng bởi DNHIEU - UAssistant</p>
      </header>

      <main className={styles.dashboard}>
        {/* Left Panel: Server Status & Metrics */}
        <section className="glass-panel">
          <div className={styles.statusBanner} data-status={serverStatus}>
            <div className={styles.statusIndicator}></div>
            <h2>SYSTEM STATUS: {serverStatus}</h2>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={`${styles.metricValue} ${cpuUsage > 80 ? styles.danger : ""}`}>
                {cpuUsage.toFixed(1)}%
              </div>
              <div className={styles.metricLabel}>CPU Load</div>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${cpuUsage > 80 ? styles.progressDanger : ""}`} 
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={`${styles.metricValue} ${ramUsage > 85 ? styles.danger : ""}`}>
                {ramUsage.toFixed(1)}%
              </div>
              <div className={styles.metricLabel}>Memory Usage</div>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${ramUsage > 85 ? styles.progressDanger : ""}`} 
                  style={{ width: `${ramUsage}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.metricCard} style={{ gridColumn: "1 / -1" }}>
              <div className={`${styles.metricValue} ${activeConnections > 1000 ? styles.danger : ""}`}>
                {activeConnections.toLocaleString()}
              </div>
              <div className={styles.metricLabel}>Active Connections</div>
            </div>
          </div>
          
          <div className={styles.infoBox}>
            <h3>How to test:</h3>
            <p>Use your preferred DDoS tool (e.g. LOIC, JMeter, or a custom script) to flood this server's endpoint.</p>
            <p className={styles.endpointPath}>Target Endpoint: <code>GET /api/ping</code></p>
            <p>Watch the metrics react in real-time as the load increases.</p>
          </div>
        </section>

        {/* Right Panel: Incoming Traffic Log */}
        <section className="glass-panel">
          <h2 className={styles.panelTitle}>Security Event Log</h2>
          <div className={styles.console}>
            {logs.length === 0 && (
              <div className={styles.logLine}>Waiting for events...</div>
            )}
            {logs.map((log, i) => (
              <div key={i} className={styles.logLine}>
                <span className={styles.logTime}>[{log.time}]</span>
                <span className={
                  log.type === "info" ? styles.logSuccess : 
                  log.type === "error" ? styles.logError : 
                  styles.logWarn
                }>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
