import { RequestHandler } from "express";
import { UserResponse, CreateUserRequest, UpdateUserRequest, ApiResponse, PaginatedResponse, User } from "@shared/api";

// Mock data for users (in production, this would be database queries)
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@iglesia360.com',
    name: 'Juan García',
    phone: '+34 666 111 111',
    status: 'active',
    roles: ['admin'],
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'tesorero@iglesia360.com',
    name: 'María López',
    phone: '+34 666 222 222',
    status: 'active',
    roles: ['tesorero'],
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    email: 'pastor@iglesia360.com',
    name: 'Carlos Rodríguez',
    phone: '+34 666 333 333',
    status: 'active',
    roles: ['pastor_general'],
    lastLogin: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    email: 'pastor_red1@iglesia360.com',
    name: 'Ana Martínez',
    phone: '+34 666 444 444',
    status: 'active',
    roles: ['pastor_red'],
    lastLogin: new Date(Date.now() - 259200000).toISOString(),
    createdAt: new Date(Date.now() - 7776000000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    email: 'miembro1@iglesia360.com',
    name: 'Pedro Sánchez',
    phone: '+34 666 555 555',
    status: 'active',
    roles: ['usuario'],
    lastLogin: new Date(Date.now() - 604800000).toISOString(),
    createdAt: new Date(Date.now() - 31536000000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 6,
    email: 'miembro2@iglesia360.com',
    name: 'Rosa González',
    phone: '+34 666 666 666',
    status: 'active',
    roles: ['usuario'],
    lastLogin: new Date(Date.now() - 1209600000).toISOString(),
    createdAt: new Date(Date.now() - 31536000000).toISOString(),
    updatedAt: new Date(Date.now() - 1209600000).toISOString(),
  },
];

export const listUsers: RequestHandler = (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;
    const role = req.query.role as string;

    let filtered = [...mockUsers];

    if (status) {
      filtered = filtered.filter(u => u.status === status);
    }

    if (role) {
      filtered = filtered.filter(u => u.roles.includes(role as any));
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filtered.slice(start, end);

    const response: PaginatedResponse<UserResponse> = {
      success: true,
      data: paginatedUsers,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};

export const getUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === parseInt(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    } as ApiResponse<UserResponse>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
};

export const createUser: RequestHandler = (req, res) => {
  try {
    const { email, name, phone, roles }: CreateUserRequest = req.body;

    // Validation
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email and name are required',
      });
    }

    if (mockUsers.some(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
      });
    }

    const newUser: User = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      email,
      name,
      phone,
      status: 'active',
      roles: roles || ['usuario'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    res.status(201).json({
      success: true,
      data: newUser,
    } as ApiResponse<UserResponse>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
};

export const updateUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, status, roles }: UpdateUserRequest = req.body;

    const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const user = mockUsers[userIndex];
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (status) user.status = status;
    if (roles) user.roles = roles;
    user.updatedAt = new Date().toISOString();

    mockUsers[userIndex] = user;

    res.json({
      success: true,
      data: user,
    } as ApiResponse<UserResponse>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
};

export const deleteUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    mockUsers.splice(userIndex, 1);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
    });
  }
};
