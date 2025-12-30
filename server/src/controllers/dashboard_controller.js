import { Op } from 'sequelize';
import { getModel } from '../config/database.js';

const get_admin_dashboard = async (req, res) => {
    try {
        const { User, Product, Order, Payment, Stock } = getModel();

        // Parallel counts
        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
            User.count(),
            Product.count(),
            Order.count()
        ]);

        // Total revenue from completed payments
        const revenueResult = await Payment.findAll({
            attributes: [[Payment.sequelize.fn('COALESCE', Payment.sequelize.fn('SUM', Payment.sequelize.col('Amount')), 0), 'totalRevenue']],
            where: { Status: 'completed' },
            raw: true
        });
        const totalRevenue = revenueResult && revenueResult[0] ? parseFloat(revenueResult[0].totalRevenue || 0) : 0;

        // Recent orders
        const recentOrders = await Order.findAll({
            order: [['Date', 'DESC']],
            limit: 5
        });

        // Orders today
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date();
        endOfDay.setHours(23,59,59,999);

        const ordersToday = await Order.count({
            where: {
                Date: { [Op.between]: [startOfDay, endOfDay] }
            }
        });

        let lowStockCount = 0;
        if (Stock) {
            lowStockCount = await Stock.count({ where: { Quantity: { [Op.lt]: 10 } } });
        }

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentOrders,
            ordersToday,
            lowStockCount
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET best sellers aggregated from completed/delivered orders
const get_best_sellers = async (req, res) => {
  try {
      const { OrderItem, Order, Product } = getModel();
      const limit = parseInt(req.query.limit) || 6;

      // Aggregate quantities by product for orders that are delivered/paid/shipped
      const sellers = await OrderItem.findAll({
          attributes: [
              'Product_Index',
              [OrderItem.sequelize.fn('SUM', OrderItem.sequelize.col('Quantity')), 'totalQuantity']
          ],
          include: [
              {
                  model: Order,
                  as: 'order',
                  attributes: [],
                  where: {
                      Status: { [Op.in]: ['delivered', 'shipped', 'paid'] }
                  }
              },
              {
                  model: Product,
                  as: 'product',
                  attributes: ['Index', 'Product_Id', 'Name', 'Price', 'Photo_URL']
              }
          ],
          group: ['Product_Index', 'product.Index', 'product.Product_Id', 'product.Name', 'product.Price', 'product.Photo_URL'],
          order: [[OrderItem.sequelize.literal('totalQuantity'), 'DESC']],
          limit,
          raw: false
      });

      const mapped = sellers.map((s) => {
          const prod = s.product || {};
          return {
              Product_Index: s.Product_Index,
              totalQuantity: Number(s.get('totalQuantity') || 0),
              Index: prod.Index,
              Product_Id: prod.Product_Id,
              Name: prod.Name,
              Price: prod.Price,
              Photo_URL: prod.Photo_URL
          };
      });

      res.json(mapped);
  } catch (err) {
      console.error('Error fetching best sellers:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
};

// GET insights: date-range, groupBy (day|month), resources
const get_insights = async (req, res) => {
    try {
        const { Order, Payment, OrderItem, Stock } = getModel();

        const qStart = req.query.start;
        const qEnd = req.query.end;
        const groupBy = req.query.groupBy || 'day';
        const resources = (req.query.resources || 'orders,revenue,products').split(',').map(r => r.trim());

        // default to last 7 days
        const end = qEnd ? new Date(qEnd) : new Date();
        const start = qStart ? new Date(qStart) : new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

        // normalize times
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);

        // helper to build date keys
        const buildDates = (s, e) => {
            const dates = [];
            const cur = new Date(s);
            while (cur <= e) {
                dates.push(new Date(cur).toISOString().slice(0,10));
                cur.setDate(cur.getDate() + 1);
            }
            return dates;
        };

        const dates = buildDates(start, end);

        const series = {
            orders: {},
            revenue: {},
            products: {}
        };

        // Initialize zeroes
        dates.forEach(d => {
            series.orders[d] = 0;
            series.revenue[d] = 0;
            series.products[d] = 0;
        });

        // Orders count grouped by date
        if (resources.includes('orders')) {
            const orderCounts = await Order.findAll({
                attributes: [[Order.sequelize.fn('DATE', Order.sequelize.col('Date')), 'date'], [Order.sequelize.fn('COUNT', Order.sequelize.col('*')), 'count']],
                where: { Date: { [Op.between]: [start, end] } },
                group: [Order.sequelize.fn('DATE', Order.sequelize.col('Date'))],
                raw: true
            });

            orderCounts.forEach(r => {
                const d = (r.date instanceof Date) ? r.date.toISOString().slice(0,10) : r.date;
                series.orders[d] = Number(r.count || 0);
            });
        }

        // Revenue sum grouped by payment created_at date (completed payments)
        if (resources.includes('revenue')) {
            const revenueRows = await Payment.findAll({
                attributes: [[Payment.sequelize.fn('DATE', Payment.sequelize.col('created_at')), 'date'], [Payment.sequelize.fn('COALESCE', Payment.sequelize.fn('SUM', Payment.sequelize.col('Amount')), 0), 'total']],
                where: { Status: 'completed', created_at: { [Op.between]: [start, end] } },
                group: [Payment.sequelize.fn('DATE', Payment.sequelize.col('created_at'))],
                raw: true
            });

            revenueRows.forEach(r => {
                const d = (r.date instanceof Date) ? r.date.toISOString().slice(0,10) : r.date;
                series.revenue[d] = Number(r.total || 0);
            });
        }

        // Products sold (sum quantity) grouped by order Date for delivered/shipped/paid orders
        if (resources.includes('products')) {
            const sold = await OrderItem.findAll({
                attributes: [[OrderItem.sequelize.fn('DATE', OrderItem.sequelize.col('order.Date')), 'date'], [OrderItem.sequelize.fn('SUM', OrderItem.sequelize.col('Quantity')), 'sold']],
                include: [
                    { model: Order, as: 'order', attributes: [], where: { Date: { [Op.between]: [start, end] }, Status: { [Op.in]: ['delivered','shipped','paid'] } } }
                ],
                group: [OrderItem.sequelize.fn('DATE', OrderItem.sequelize.col('order.Date'))],
                raw: true
            });

            sold.forEach(r => {
                const d = (r.date instanceof Date) ? r.date.toISOString().slice(0,10) : r.date;
                series.products[d] = Number(r.sold || 0);
            });
        }

        // low stock count (overall)
        let lowStockCount = 0;
        if (resources.includes('stock')) {
            const { Stock } = getModel();
            lowStockCount = await Stock.count({ where: { Quantity: { [Op.lt]: 10 } } });
        }

        // Format series arrays
        const formatted = {
            dates,
            orders: dates.map(d => ({ date: d, value: series.orders[d] || 0 })),
            revenue: dates.map(d => ({ date: d, value: series.revenue[d] || 0 })),
            products: dates.map(d => ({ date: d, value: series.products[d] || 0 })),
            meta: { lowStockCount }
        };

        res.json({ start: start.toISOString().slice(0,10), end: end.toISOString().slice(0,10), groupBy, ...formatted });
    } catch (err) {
        console.error('Error fetching insights:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { get_admin_dashboard, get_best_sellers, get_insights };
