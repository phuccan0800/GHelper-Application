const UnitOfWork = require('../UnitOfWork/UnitOfWork');
const UserRoleDTO = require('../dtos/userRole.dto');
const userRoleRepository = require('../repositories/userRole.repository');

const createUserRole = async (req, res) => {
    const unitOfWork = new UnitOfWork();

    try {
        const { userID, role } = req.body;
        const newUserRole = await unitOfWork.repositories.userRoleRepository.create({ userID, role });
        const userRoleDTO = new UserRoleDTO(newUserRole.toObject());
        res.status(201).json({ message: 'UserRole created successfully', userRole: userRoleDTO });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserRoles = async (req, res) => {
    try {
        const userRoles = await userRoleRepository.findAll();
        const userRolesDTO = userRoles.map(userRole => new UserRoleDTO(userRole.toObject()));
        res.json(userRolesDTO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserRoleById = async (req, res) => {
    try {
        const userRole = await userRoleRepository.findById(req.params.id);
        if (!userRole) {
            return res.status(404).json({ message: 'UserRole not found' });
        }
        const userRoleDTO = new UserRoleDTO(userRole.toObject());
        res.json(userRoleDTO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const unitOfWork = new UnitOfWork();

    try {
        const { userID, role } = req.body;
        const userRole = await unitOfWork.repositories.userRoleRepository.update(req.params.id, { userID, role });
        if (!userRole) {
            return res.status(404).json({ message: 'UserRole not found' });
        }
        const userRoleDTO = new UserRoleDTO(userRole.toObject());
        res.json({ message: 'UserRole updated successfully', userRole: userRoleDTO });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUserRole = async (req, res) => {
    const unitOfWork = new UnitOfWork();

    try {
        const userRole = await unitOfWork.repositories.userRoleRepository.delete(req.params.id);
        if (!userRole) {
            return res.status(404).json({ message: 'UserRole not found' });
        }
        res.json({ message: 'UserRole deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUserRole,
    getUserRoles,
    getUserRoleById,
    updateUserRole,
    deleteUserRole
};
