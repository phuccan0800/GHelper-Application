const UserRoleDTO = require('../dtos/userRole.dto');
const UserRole = require('../models/userRole.model');

// Create User Role
const createUserRole = async (req, res) => {
    try {
        const { userID, role } = req.body;
        const newUserRole = await UserRole.create({ userID, role });
        const userRoleDTO = new UserRoleDTO(newUserRole.toObject());
        res.status(201).json({ message: 'UserRole created successfully', userRole: userRoleDTO });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All User Roles
const getUserRoles = async (req, res) => {
    try {
        const userRoles = await UserRole.find();
        const userRolesDTO = userRoles.map(userRole => new UserRoleDTO(userRole.toObject()));
        res.json(userRolesDTO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Role by ID
const getUserRoleById = async (req, res) => {
    try {
        const userRole = await UserRole.findById(req.params.id);
        if (!userRole) {
            return res.status(404).json({ message: 'UserRole not found' });
        }
        const userRoleDTO = new UserRoleDTO(userRole.toObject());
        res.json(userRoleDTO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User Role
const updateUserRole = async (req, res) => {
    try {
        const { userID, role } = req.body;
        const userRole = await UserRole.findByIdAndUpdate(req.params.id, { userID, role }, { new: true });
        if (!userRole) {
            return res.status(404).json({ message: 'UserRole not found' });
        }
        const userRoleDTO = new UserRoleDTO(userRole.toObject());
        res.json({ message: 'UserRole updated successfully', userRole: userRoleDTO });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete User Role
const deleteUserRole = async (req, res) => {
    try {
        const userRole = await UserRole.findByIdAndDelete(req.params.id);
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
