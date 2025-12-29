import express from 'express';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';

const app = express();
app.use(express.json());

const orderRepository = new PrismaOrderRepository();
const mailProvider = new EtherealMailProvider();
const notificationService = new NotificationService(mailProvider);
const orderService = new OrderService(orderRepository, notificationService);
const orderController = new OrderController(orderService);

app.post('/orders', orderController.processOrder);

export default app;
