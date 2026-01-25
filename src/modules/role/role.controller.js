import prisma from "../../lib/prisma.js";

export default {
    getAllRoles: async (req, res) => {
        const roles = await prisma.role.findMany()
        res.json({
            success: true,
            data: roles,
            message: 'Roles fetched successfully'
        })
    },

    createRole: async (req, res) => {
        const { name } = req.body

        const role = await prisma.role.create({
            data: {
                name
            }
        })
        res.json({
            success: true,
            data: role,
            message: 'Role created successfully'
        })
    },

    updateRole: async (req, res) => {
        const { id } = req.params
        const { name } = req.body

        const role = await prisma.role.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name
            }
        })
        res.json({
            success: true,
            data: role,
            message: 'Role updated successfully'
        })
    },

    deleteRole: async (req, res) => {
        const { id } = req.params

        const role = await prisma.role.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.json({
            success: true,
            data: role,
            message: 'Role deleted successfully'
        })
    }
}