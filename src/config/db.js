import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async function () {
    prisma.$use(async (params, next) => {
        if ( ['Type','SubType', 'Make', 'Model'].some(val=>val == params.model)) {
            return next(params)
        }
        if (!params?.args) params.args = {};
        if (params.action === 'findUnique' || params.action === 'findFirst') {
            params.action = 'findFirst';
            params.args.where['is_deleted'] = false;
        }
        if (params.action === 'findMany') {
            if (params?.args?.where) {
                if (params.args.where.deleted == undefined) {
                    // Exclude deleted records if they have not been explicitly requested
                    params.args.where['is_deleted'] = false;
                }
            } else {
                params.args['where'] = { is_deleted: false }
            }
        }
        if (params.action == 'update') {
            params.action = 'updateMany';
            params.args.where['is_deleted'] = false;
        }
        if (params.action == 'updateMany') {
            if (params?.args?.where != undefined) {
                params.args.where['is_deleted'] = false;
            } else {
                params.args['where'] = { is_deleted: false }
            }
        }
        if (params.action == 'delete') {
            params.action = 'update';
            params.args['data'] = { is_deleted: true, deleted_at: new Date() }
        }
        if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany';
            if (params?.args?.data != undefined) {
                params.args.data['is_deleted'] = true;
                params.args.data['deleted_at'] = new Date();
            } else {
                params.args['data'] = { is_deleted: true, deleted_at: new Date() }
            }
        }
        return next(params)
    });
};
await main();
export default prisma;