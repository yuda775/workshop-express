import prisma from "../../lib/prisma.js";
import bcrypt from 'bcryptjs';

export default {
    getAllUsers: async (req, res) => {
        const users = await prisma.user.findMany({
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        })

        const userData = users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles.map((role) => {
                    return {
                        id: role.role.id,
                        name: role.role.name
                    }
                })
            }
        })

        res.json({
            success: true,
            data: userData,
            message: 'Users fetched successfully'
        })
    },

    createUser: async (req, res) => {
        const { name, email, password, roles, role } = req.body
        const userRoles = roles || role

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: (userRoles && userRoles.length > 0) ? {
                    create: userRoles.map((id) => ({
                        role: {
                            connect: { id: parseInt(id) }
                        }
                    }))
                } : undefined
            },
            include: {
                roles: true
            }
        })
        res.json({
            success: true,
            data: user,
            message: 'User created successfully'
        })
    },

    updateUser: async (req, res) => {
        const { id } = req.params
        const { name, email, roles } = req.body
        const userRoles = roles

        const user = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name || undefined,
                email: email || undefined,
                roles: (userRoles) ? {
                    deleteMany: {},
                    create: userRoles.map((id) => ({
                        role: {
                            connect: { id: parseInt(id) }
                        }
                    }))
                } : undefined
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        })
        res.json({
            success: true,
            data: user,
            message: 'User updated successfully'
        })
    },

    deleteUser: async (req, res) => {
        const { id } = req.params

        await prisma.user_role.deleteMany({
            where: {
                user_id: parseInt(id)
            }
        })

        const user = await prisma.user.delete({
            where: {
                id: parseInt(id)
            }
        })


        res.json({
            success: true,
            data: user,
            message: 'User deleted successfully'
        })
    },

    changePassword: async (req, res) => {
        const { id } = req.params
        const { password } = req.body

        const user = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                password
            }
        })
        res.json({
            success: true,
            data: user,
            message: 'Password changed successfully'
        })
    }
}