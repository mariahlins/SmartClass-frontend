import { useEffect, useState } from "react";
import styles from "./Users.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";
import UserController from "../../../../controllers/user/userController";
import CursoController from "../../../../controllers/lms/cursoController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import NewManager from "../../../components/Manager/Modal/NewManager";
import NewStudent from "../../../components/Manager/Modal/NewStudent";
import NewTeacher from "../../../components/Manager/Modal/NewTeacher";

const UsersManager = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedUser, setSelectedUser] = useState(null);
	const [activeModal, setActiveModal] = useState(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [editFormData, setEditFormData] = useState({
		name: "",
		email: "",
		cpf: "",
		is_manager: false,
		is_teacher: false,
		is_student: false
	});
	
	const itemsPerPage = 7;

	const loadUsers = async () => {
		try {
			setLoading(true);
			const response = await UserController.obterTodosUsuarios();
			setUsers(response);
			setLoading(false);
		} catch (error) {
			console.error("Erro ao carregar usuários:", error.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const getUserRole = (user) => {
		if (user.is_manager) return "Administrador";
		if (user.is_teacher) return "Professor";
		if (user.is_student) return "Estudante";
		return "Indefinido";
	};

	const handleEditModalToggle = (user = null) => {
		if (user) {
			setSelectedUser(user);
			setEditFormData({
				name: user.name,
				email: user.email,
				cpf: user.cpf,
				is_manager: user.is_manager || false,
				is_teacher: user.is_teacher || false,
				is_student: user.is_student || false
			});
			setShowEditModal(true);
		} else {
			setShowEditModal(false);
			setSelectedUser(null);
		}
	};

	const handleDeleteConfirmationToggle = (user = null) => {
		if (user) {
			setSelectedUser(user);
			setShowDeleteConfirmation(true);
		} else {
			setShowDeleteConfirmation(false);
			setSelectedUser(null);
		}
	};

	const handleEditInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setEditFormData({
			...editFormData,
			[name]: type === 'checkbox' ? checked : value
		});
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		try {
			await UserController.atualizarUsuario(selectedUser.id, editFormData);
			handleEditModalToggle();
			await loadUsers();
		} catch (error) {
			console.error("Erro ao editar usuário:", error.message);
		}
	};

	const handleDeleteUser = async () => {
		try {
			await UserController.deletarUsuario(selectedUser.id);
			handleDeleteConfirmationToggle();
			await loadUsers();
		} catch (error) {
			console.error("Erro ao deletar usuário:", error.message);
		}
	};

	const toggleModal = (modalType) => {
		setActiveModal(activeModal === modalType ? null : modalType);
	};

	const handleUserCreated = () => {
		loadUsers();
		setActiveModal(null); 
	  };

	const totalPages = Math.ceil(users.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return (
		<div className={styles["cls-manager"]}>
			<Header />
			<SideBar />
			<main className={styles["cls-content"]}>
				<div className={styles["cls-header"]}>
					<h1>Usuários</h1>
					<div style={{ display: "flex", gap: "10px" }}>
						<button onClick={() => toggleModal('manager')}>Add Manager</button>
						<button onClick={() => toggleModal('student')}>Add Student</button>
						<button onClick={() => toggleModal('teacher')}>Add Teacher</button>
					</div>
				</div>
				{loading ? (
					<p>Carregando...</p>
				) : (
					<>
						<table className={styles["user-table"]}>
							<thead>
								<tr>
									<th>ID</th>
									<th>Nome</th>
									<th>Email</th>
									<th>CPF</th>
									<th>Role</th>
									<th>Ações</th>
								</tr>
							</thead>
							<tbody>
								{currentUsers.map((user) => (
									<tr key={user.id}>
										<td>{user.id}</td>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td>{user.cpf}</td>
										<td>{getUserRole(user)}</td>
										<td className={styles["action-buttons"]}>
											<button 
												onClick={() => handleEditModalToggle(user)}
												className={styles["edit-button"]}
											>
												<FontAwesomeIcon icon={faPen} />
											</button>
											<button 
												onClick={() => handleDeleteConfirmationToggle(user)}
												className={styles["delete-button"]}
											>
												<FontAwesomeIcon icon={faTrash} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className={styles["cls-pagination"]}>
							<button 
								onClick={() => handlePageChange(currentPage - 1)} 
								disabled={currentPage === 1}
							>
								&#8592;
							</button>
							<span>Página {currentPage} de {totalPages}</span>
							<button 
								onClick={() => handlePageChange(currentPage + 1)} 
								disabled={currentPage === totalPages}
							>
								&#8594;
							</button>
						</div>
					</>
				)}
			</main>

			<NewManager 
				isOpen={activeModal === 'manager'}
				onClose={() => toggleModal('manager')}
				onUserCreated={handleUserCreated}
			/>
			
			<NewStudent 
				isOpen={activeModal === 'student'}
				onClose={() => toggleModal('student')}
				onUserCreated={handleUserCreated}
			/>
			
			<NewTeacher 
				isOpen={activeModal === 'teacher'}
				onClose={() => toggleModal('teacher')}
				onUserCreated={handleUserCreated}
			/>

			{showEditModal && (
				<div className={styles.modal}>
					<div className={styles["modal-content"]}>
						<h2>Editar Usuário</h2>
						<form onSubmit={handleEditSubmit}>
							<div className={styles["form-group"]}>
								<label>Nome</label>
								<input
									type="text"
									name="name"
									value={editFormData.name}
									onChange={handleEditInputChange}
									required
								/>
							</div>

							<div className={styles["form-group"]}>
								<label>Email</label>
								<input
									type="email"
									name="email"
									value={editFormData.email}
									onChange={handleEditInputChange}
									required
								/>
							</div>

							<div className={styles["form-group"]}>
								<label>CPF</label>
								<input
									type="text"
									name="cpf"
									value={editFormData.cpf}
									onChange={handleEditInputChange}
									required
								/>
							</div>

							<div className={styles["form-buttons"]}>
								<button
									type="button"
									onClick={() => handleEditModalToggle()}
									className={styles["cancel-button"]}
								>
									Cancelar
								</button>
								<button type="submit" className={styles["save-button"]}>
									Salvar Alterações
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{showDeleteConfirmation && (
				<div className={styles.modal}>
					<div className={styles["modal-content"]}>
						<h2>Confirmar Exclusão</h2>
						<p>Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?</p>
						<div className={styles["form-buttons"]}>
							<button
								type="button"
								onClick={() => handleDeleteConfirmationToggle()}
								className={styles["cancel-button"]}
							>
								Cancelar
							</button>
							<button
								onClick={handleDeleteUser}
								className={styles["delete-confirm-button"]}
							>
								Confirmar Exclusão
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UsersManager;