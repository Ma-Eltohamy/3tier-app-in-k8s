import React from 'react';
import '../style/Sidebar.css';

let id_instruc = localStorage.getItem("ID_instactor")
const Sidebar_inst = ({ logo, name, children, openOnHover }) => {
	const links = [
		{
			to: `/login/DashBoard/instractor/${id_instruc}/View_courses_instractor`,
			label: 'Courses',
			icon: <i class='bx bx-book-alt'></i>,
			sublinks: []
		},
		
		
		
	];
	
	const profile = {
		name: 'Ahemd Khaled',
		job: 'Admin'
	};
	
	const [isClose, setIsClose] = React.useState(true);
	const toggleIsClose = () => setIsClose(!isClose);
	
	const Link = ({to, icon, label, sublinks}) => {
		
		const [isOpen, setIsOpen] = React.useState(false);
		const toggleIsOpen = () => setIsOpen(!isOpen);
		
		const SubLinks = ({ links }) => (
			links.map(({to, label}, key) => (
				<li key={key}>
					<a href={to}>{label}</a>
				</li>
			))
		);
		
		const Dropdown = ({to, icon, label, linksCount}) => {
			let dropdown = null;
			
			if (linksCount > 0) {
				dropdown = <i className='bx bxs-chevron-down arrow' onClick={toggleIsOpen}></i>;
			}
			
			return (
				<div className="iocn-link">
					<a href={to}>
						{ icon }
						<span className="link_name">{label}</span>
					</a>
					{ dropdown }
				</div>
			);
		};
		
		return (
			<li className={isOpen ? 'showMenu' : ''}>
				<Dropdown to={to} icon={icon} label={label} linksCount={sublinks.length} />
				<ul className={sublinks.length > 0 ? 'sub-menu' : 'sub-menu blank'}>
					<li><a className="link_name" href={to}>{label}</a></li>
					<SubLinks links={sublinks} />
				</ul>
			</li>
		);
	};
	
	const Links = ({ links }) => (
		links.map((link, key) => (
			<Link key={key} {...link} />
		))
	);
	
	return (
    <div>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
		<main>
			<aside
				className={isClose ? 'sidebar close' : 'sidebar'}
			>
				<section className='logo-details'>
					{ logo }
					<span className='logo_name'>{ name }</span>
				</section>
				<ul className='nav-links'>
					<Links links={links} />
					<li>
						<div className="profile-details">
							<div className="name-job">
								<div className="profile_name">{profile.name}</div>
								<div className="job">{profile.job}</div>
							</div>
							<i className='bx bx-log-out'></i>
						</div>
					</li>
				</ul>
				{
					openOnHover ? null : (
						<div className="menu">
							<i className='bx bx-menu' onClick={toggleIsClose}></i>
						</div>
					)
				}
			</aside>
			<section className="home-section">
					{ children }
			</section>
		</main>
    </div>
	);
};

export default Sidebar_inst;
