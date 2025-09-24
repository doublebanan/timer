import { Routes, Route, Navigate } from "react-router-dom";

import HeaderBar from "../widgets/header-bar/ui/HeaderBar";
import HomePage from "../pages/home/ui/HomePage";
import SettingPage from "../pages/setting/ui/SettingPage";
import StatisticsPage from "../pages/statistics/ui/StatisticsPage";

import styles from "./App.module.css";

function App() {
    return (
        <div className={styles.app}>
            <HeaderBar />
            <main className={styles.main}>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/setting" element={<SettingPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
