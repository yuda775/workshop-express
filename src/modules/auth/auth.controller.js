import prisma from "../../lib/prisma.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default {
    register: async (req, res) => {
        const { name, email, password, roles } = req.body

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: {
                    create: roles.map((id) => ({
                        role: {
                            connect: { id: parseInt(id) }
                        }
                    }))
                }
            }
        })
        res.json({
            success: true,
            data: user,
            message: 'User registered successfully'
        })
    },

    login: async (req, res) => {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }

        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            })
        }

        const userRoles = user.roles.map((role) => role.role.name)

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, roles: userRoles }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roles: userRoles
                },
                token
            },
            message: 'User logged in successfully'
        })
    }
}