import { ReactComponent as CloseIcon } from "../../../shared/assets/icons/close.svg";
import { ReactComponent as MinimizeIcon } from "../../../shared/assets/icons/minimize.svg";

import styles from "./HeaderBar.module.css";

const HeaderBar = () => {
    return (
        <div className={styles.bar}>
            <button
                onClick={() => window.windowControls.minimize()}
                className={styles.minimize}
            >
                <MinimizeIcon className={styles.icon} />
            </button>
            <button
                onClick={() => window.windowControls.close()}
                className={styles.close}
            >
                <CloseIcon className={styles.icon} />
            </button>
        </div>
    );
};

export default HeaderBar;
