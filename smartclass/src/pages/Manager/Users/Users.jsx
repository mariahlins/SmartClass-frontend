import { useEffect, useState } from "react";
import styles from "./Users.module.css";
import Header from "../../../components/Header/Header";
import SideBar from "../../../components/Manager/SideBar/SideBar";
import UserController from "../../../../controllers/user/userController";
import AuthController from "../../../../controllers/authController";
import CursoController from "../../../../controllers/lms/cursoController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const UsersManager = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [cursos, setCursos] = useState([]);
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
	const [formData, setFormData] = useState({
			name: "",
			cpf: "",
			email: "",
			password: "",
			role:"",
			curso:"",
			is_manager: false,
			is_teacher: false,
			is_student: false
	});
	
	const itemsPerPage = 7;

	useEffect(() => {
		async function carregarUsuarios() {
			try {
				const response = await UserController.obterTodosUsuarios();
				setUsers(response);
				setLoading(false);
			} catch (error) {
				console.error("Erro ao carregar usuários:", error.message);
			}
		}
		carregarUsuarios();
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
			const response = await UserController.obterTodosUsuarios();
			setUsers(response);
		} catch (error) {
			console.error("Erro ao editar usuário:", error.message);
		}
	};

	const handleDeleteUser = async () => {
		try {
			await UserController.deletarUsuario(selectedUser.id);
			handleDeleteConfirmationToggle();
			const response = await UserController.obterTodosUsuarios();
			setUsers(response);
		} catch (error) {
			console.error("Erro ao deletar usuário:", error.message);
		}
	};

	const handleModalToggle = () => {
		setShowModal(!showModal);
	};

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			formData.role = formData.is_manager ? "manager" : formData.is_teacher ? "teacher" : "student";
			const responsereg = await AuthController.register(formData);
			console.log(responsereg)
			handleModalToggle();
			const response = await UserController.obterTodosUsuarios();
			setUsers(response);
		} catch (error) {
			console.error("Erro ao criar turma:", error.message);
		}
	};

	useEffect(() => {
		async function carregarCursos() {
			try {
				const cursos = await CursoController.listar();
				const formattedCursos = cursos.map(curso => ({
					value: curso.id,
					label: curso.nome,
				}));
				setCursos(formattedCursos);
			} catch (error) {
				console.error('Erro ao buscar cursos:', error);
			}
		}
	
		carregarCursos();
	}, []);


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
					<h1>Turmas</h1>
					<button onClick={handleModalToggle}>Criar novo usuário</button>
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

			{showModal && (
				<div className={styles.modal}>
					<div className={styles["modal-content"]}>
						<h2>Criar novo usuário</h2>
						<form onSubmit={handleSubmit}>
						<div className={styles["form-group"]}>
								<label>Nome</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className={styles["form-group"]}>
								<label>Email</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className={styles["form-group"]}>
								<label>CPF</label>
								<input
									type="text"
									name="cpf"
									value={formData.cpf}
									onChange={handleInputChange}
									required
								/>
							</div>
							
							<div className={styles["form-group"]}>
								<label>Senha</label>
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className={styles["form-group-checkboxes"]}>
								<div className={styles["checkbox-item"]}>
									<input
										type="checkbox"
										id="is_manager"
										name="is_manager"
										checked={formData.is_manager}
										onChange={handleInputChange}
									/>
									<label htmlFor="is_manager">Administrador</label>
								</div>

								<div className={styles["checkbox-item"]}>
									<input
										type="checkbox"
										id="is_teacher"
										name="is_teacher"
										checked={formData.is_teacher}
										onChange={handleInputChange}
									/>
									<label htmlFor="is_teacher">Professor</label>
								</div>

								<div className={styles["checkbox-item"]}>
									<input
										type="checkbox"
										id="is_student"
										name="is_student"
										checked={formData.is_student}
										onChange={handleInputChange}
									/>
									<label htmlFor="is_student">Estudante</label>
								</div>
								{formData.is_student && (
									<div className={styles["form-group"]}>
								    <label>Curso</label>
								    <select
						    			name="curso_id"
				    					value={formData.curso_id}
		    							onChange={handleInputChange}
    									required
							    	>
						    			<option value="">Selecione um curso</option>
				    					{cursos.map((curso) => (
		    								<option key={curso.value} value={curso.value}>
    											{curso.label}
										    </option>
								    	))}
								    </select>
							    </div>
								)}
							</div>
 
							<div className={styles["form-buttons"]}>
								<button type="button" 
												onClick={handleModalToggle}
												className={styles["cm-cancel-button"]}>
									Cancelar
								</button>
								<button type="submit" className={styles["cm-criar"]}>Criar Turma</button>
							</div>
						</form>
					</div>
				</div>
			)}


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

							<div className={styles["form-group-checkboxes"]}>
								<div className={styles["checkbox-item"]}>
									<input
										type="checkbox"
										id="is_manager"
										name="is_manager"
										checked={editFormData.is_manager}
										onChange={handleEditInputChange}
									/>
									<label htmlFor="is_manager">Administrador</label>
								</div>

								<div className={styles["checkbox-item"]}>
									<input
										type="checkbox"
										id="is_teacher"
										name="is_teacher"
										checked={editFormData.is_teacher}
										onChange={handleEditInputChange}
									/>
									<label htmlFor="is_teacher">Professor</label>
								</div>

								<div className={styles["checkbox-item"]}>
									<input
										type="checkbox"
										id="is_student"
										name="is_student"
										checked={editFormData.is_student}
										onChange={handleEditInputChange}
									/>
									<label htmlFor="is_student">Estudante</label>
								</div>
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