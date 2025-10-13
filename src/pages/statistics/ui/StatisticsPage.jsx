import StatsWidget from "../../../widgets/statsWidget";

import styles from "./StatisticsPage.module.css";

const StatisticsPage = () => {
    return (
        <div className={styles.statistics}>
            <StatsWidget days={7} />
        </div>
    );
};

export default StatisticsPage;
