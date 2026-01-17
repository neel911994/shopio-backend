import prisma from "../utils/prisma";

// TODO: Implement your KPI logic here

export const getKpis = async () => {
    // Example KPIs you might want to implement:
    // - Total revenue

    const totalRevenue = await prisma.order.aggregate({
        where: { status: { in: ['PAID', 'DELIVERED'] } },
        _sum: { totalAmount: true }
    }
    );

    const totalOrder = await prisma.order.count();
    const SuccessfulOrder =await prisma.order.count({
        where:{ status: {in:  ['PAID', 'SHIPPED','DELIVERED']}}
    })
    const cancelledOrder = await prisma.order.count({
        where:{
            status:{
                in: ['CANCELLED']
            }
        }
    })
    const orderByStatus = await prisma.order.groupBy({
        by: ['status'],
        _count:true
    })

    const avgOrderValue = await prisma.order.aggregate({
        _avg:{
            totalAmount:true
        }
    })

    const lowStockProduct =await prisma.product.findMany({
        where:{
            stock: {
                lt: 10
            }
        },
        orderBy:{
            stock: 'asc'
        },
        select:{
            id:true,
            name: true,
            description: true,
            price: true,
            stock:true,
            category:{
                select:{
                    name:true
                }
            }
        }
    });
    const products = await prisma.product.findMany({
        select:{
            price:true,
            stock:true
        }
    })
    const inventoryValue = products.reduce((sum,product)=>{
        return sum= product.price * product.stock
    },0)

    const topSellingProducts = await prisma.orderItem.groupBy({
        by:['productId'],
        _sum:{
            quantity:true
        },
        orderBy:{
            _sum:{
                quantity:'desc'
            }
        },
        take:5
    })
    const topProducts = await Promise.all(
        topSellingProducts.map(async(item)=>{
            const product = await prisma.product.findUnique({
                where:{
                    id:item.productId
                },
                select:{
                    id:true,
                    name:true,
                    description:true,
                    price:true,
                    category:{
                        select:{
                            name: true
                        }
                    }
                }
            })
            return {
                ...product, totalQuantitySold: item._sum.quantity
            }
        })
    )

    return {
        // Add your KPI data here
        totalRevenue, totalOrder, SuccessfulOrder, cancelledOrder, orderByStatus, avgOrderValue, lowStockProduct, inventoryValue, topProducts
    };
};
