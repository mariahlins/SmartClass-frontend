import styles from './SideBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserEdit, faAddressBook, faSignOut, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'

const SideBar = () => {
    const location = useLocation();
    const menuItems = [
        { name: 'Página Inicial', icon: faHome, path: '/home-manager'},
        { name: 'Editar perfil', icon: faUserEdit, path: '/profile-manager' },
        { name: 'Turmas', icon: faAddressBook, path: '/classes-manager' },
        { name: 'Usuários', icon: faUsers, path: '/users' },
        { name: 'Logout', icon: faSignOut, path: '/' },
    ];

    const name = localStorage.getItem('userName') || '';

    //salvei no localstorage para que o nome não seja perdido nas mudanças de página
    if (location.state?.name) {
        localStorage.setItem('userName', location.state.name);
    }

    return (
        <div>
            <div className={styles["sidebar"]}>
            <div className={styles["sb-header"]}>
                <FontAwesomeIcon icon={faUser} className="icon" />
                <h3>Olá, {name.split(' ')[0]}</h3>
            </div>
                <nav className={styles["sb-itens"]}>
                    <ul>
                        {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link to={item.path}>
                                <button style={{borderColor:"2px solid #6b3cfa"}}className={`${styles["sb-item"]} ${location.pathname === item.path ? styles["active"] : ''}`}>
                                <FontAwesomeIcon icon={item.icon} className={styles["icon"]} />
                                {item.name}
                                </button>
                            </Link>
                        </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default SideBar;
