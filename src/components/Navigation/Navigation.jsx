import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.scss';
import logo from './navLogo.png';

const Navigation = () => (
	<div className={styles.navBar}>
		<div className={styles.navBarContainer}>

			<img src={logo} alt="logo" className={styles.logo} />

			<div className={styles.linkListContainer}>
				<div className={styles.linkList}>
					<Link
						to="/home"
						className={styles.navLinks}
						style={{ textDecoration: 'none' }}
						draggable="false"
					>Home
					</Link>

					<Link
						to="/chat"
						className={styles.navLinks}
						style={{ textDecoration: 'none' }}
						draggable="false"
					>Download
					</Link>

					<Link
						to="/signup"
						className={styles.navLinks}
						style={{ textDecoration: 'none' }}
						draggable="false"
					>About
					</Link>

					<Link
						to="/chat"
						className={styles.navLinks}
						style={{ textDecoration: 'none' }}
						draggable="false"
					>Login
					</Link>

					{/* make into white button with purple text later */}
					<Link
						to="/signup"
						className={styles.navLinks}
						style={{ textDecoration: 'none' }}
						draggable="false"
					>Sign up
					</Link>
				</div>
			</div>

		</div>
	</div>
);

export default Navigation;
