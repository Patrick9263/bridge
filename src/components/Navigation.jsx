import React from 'react';
import {
	Navbar, Nav, NavDropdown, NavItem, Form, FormControl, Button,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.scss';

const Navigation = () => (
	<Navbar bg="dark" variant="dark" expand="lg" className={styles.noselect} >
		<Navbar.Brand href="#home">
			<img
				alt=""
				src="/favicon.ico"
				width="30"
				height="30"
				className="d-inline-block align-top"
				draggable="false"
			/>{' '}
			bridge
		</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" draggable="false" />
		<Navbar.Collapse id="basic-navbar-nav" draggable="false">
			<Nav className="mr-auto" draggable="false">

				<NavItem>
					<NavLink
						exact to="/home"
						className="nav-link"
						activeClassName="active"
						draggable="false"
					>Home
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						exact to="/about"
						className="nav-link"
						activeClassName="active"
						draggable="false"
					>About
					</NavLink>
				</NavItem>

				<NavDropdown title="Menu" id="basic-nav-dropdown">
					<NavDropdown.Item href="#action/3.1" draggable="false">Action</NavDropdown.Item>
					<NavDropdown.Item href="#action/3.2" draggable="false">Another action</NavDropdown.Item>
					<NavDropdown.Item href="#action/3.3" draggable="false">Something</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item href="#action/3.4" draggable="false">Separated link</NavDropdown.Item>
				</NavDropdown>

			</Nav>
			<Form inline>
				<FormControl type="text" placeholder="Search" className="mr-sm-2" />
				<Button variant="outline-info">Search</Button>
			</Form>
		</Navbar.Collapse>
	</Navbar>
);

export default Navigation;
