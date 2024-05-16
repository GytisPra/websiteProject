import {
  NotificationTypes,
  OrderStatus,
  type Order,
  type User,
} from "@prisma/client";

import { prisma } from "~/db.server";
import { getUserByEmail } from "./user.server";
import { sendNotification } from "./notification.server";
import OrdersTable from "~/components/common/OrderPage/OrdersTable";

export type { Order } from "@prisma/client";

export async function updateOrderStatus(
  newStatus: OrderStatus,
  orderId: Order["id"],
) {
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: newStatus },
  });

  return updatedOrder;
}

export async function getOrderById(id: Order["id"], includeUserID?: boolean) {
  if (includeUserID) {
    const orderWithIDs = await prisma.order.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true } },
        worker: { select: { id: true } },
      },
    });

    return orderWithIDs;
  } else {
    const orderNoIDs = await prisma.order.findUnique({ where: { id } });

    return orderNoIDs;
  }
}

export async function checkOrders() {
  const currentDate = new Date();

  const orders = await prisma.order.findMany({
    where: {
      completionDate: { lte: currentDate },
      orderStatus: {
        in: [OrderStatus.PLACED, OrderStatus.IN_PROGRESS, OrderStatus.ACCEPTED],
      },
    },
  });

  await Promise.all(
    orders.map(async (order) => {
      console.log(`Sending notifications and updating status for ${order.id}`);

      await sendNotification(
        order.customerId,
        `Užsakymas ${order.orderName} baigtas`,
        NotificationTypes.ORDER_COMPLETED,
        order.id,
      );
      await sendNotification(
        order.workerId,
        `Užsakymas ${order.orderName} baigtas`,
        NotificationTypes.ORDER_COMPLETED,
        order.id,
      );
      await updateOrderStatus(OrderStatus.COMPLETED, order.id);
    }),
  );
}

export async function getOrdersByUserId(
  userId: User["id"],
  includeUserName?: boolean,
): Promise<Order[] | null> {
  try {
    let includeCreatedBy = {};
    if (includeUserName) {
      includeCreatedBy = { createdBy: { select: { userName: true } } };
    }

    const workerOrders = await prisma.order.findMany({
      where: {
        workerId: userId,
      },
      include: includeCreatedBy,
    });

    if (workerOrders.length > 0) {
      return workerOrders;
    }

    const customerOrders = await prisma.order.findMany({
      where: {
        customerId: userId,
      },
      include: includeCreatedBy,
    });

    if (customerOrders.length > 0) {
      return customerOrders;
    }

    return null;
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    return null;
  }
}

export async function getAcceptedOrdersByUserId(
  userId: User["id"],
  includeUserName?: boolean,
): Promise<Order[] | null> {
  try {
    let includeCreatedBy = {};
    if (includeUserName) {
      includeCreatedBy = { createdBy: { select: { userName: true } } };
    }

    const workerOrders = await prisma.order.findMany({
      where: {
        workerId: userId,
        orderStatus: "ACCEPTED"
      },
      include: includeCreatedBy,
    });

    if (workerOrders.length > 0) {
      return workerOrders;
    }

    return null;
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    return null;
  }
}

export async function getOrdersByEmail(email: User["email"]) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  return getOrdersByUserId(user.id);
}

export async function getAcceptedOrdersByEmail(email: User["email"]) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  return getAcceptedOrdersByUserId(user.id);
}

export async function updateOrder(
  orderId: Order["id"],
  orderName?: string,
  createdBy?: User,
  worker?: User,
  completionDate?: Date,
  revisionDays?: number,
  description?: string,
  footageLink?: string,
) {
  const check = await getOrderById(orderId);

  if (
    (check?.orderStatus === OrderStatus.DECLINED ||
      check?.orderStatus === OrderStatus.PLACED) &&
    worker?.id !== check?.workerId
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        orderName: orderName,
        completionDate: completionDate,
        revisionDays: revisionDays,
        description: description,
        footageLink: footageLink,
        orderStatus: OrderStatus.PLACED,
        worker: {
          connect: { id: worker?.id },
        },
        createdBy: {
          connect: { id: createdBy?.id },
        },
      },
    });
  } else {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        orderName: orderName,
        completionDate: completionDate,
        revisionDays: revisionDays,
        description: description,
        footageLink: footageLink,
        createdBy: {
          connect: { id: createdBy?.id },
        },
      },
    });
  }
}

export async function createOrder(
  orderName: string,
  createdBy: User,
  worker: User,
  completionDate: Date,
  revisionDays: number,
  description: string,
  footageLink: string,
) {
  return prisma.order.create({
    data: {
      orderName: orderName,
      completionDate: completionDate,
      revisionDays: revisionDays,
      orderStatus: OrderStatus.PLACED,
      description: description,
      footageLink: footageLink,
      worker: {
        connect: { id: worker.id },
      },
      createdBy: {
        connect: { id: createdBy.id },
      },
    },
  });
}

export async function deleteOrdersByEmail(email: User["email"]) {
  const orders = await getOrdersByEmail(email);

  if (!orders) return null;

  for (const order of orders) {
    await prisma.order.delete({
      where: { id: order.id },
    });
  }

  return true;
}

export async function calculateOrdersByUserID(userId: User["id"]) {
  const orders = await getOrdersByUserId(userId);

  const completedOrders = orders?.filter(
    (order) =>
      order.orderStatus === OrderStatus.COMPLETED ||
      order.orderStatus === OrderStatus.PAYED,
  );
  const rejectedOrders = orders?.filter((order) =>
    order.orderStatus.includes(OrderStatus.DECLINED),
  );

  const completedOrdersCount = completedOrders?.length;
  const allOrdersCount = Number(orders?.length) - Number(rejectedOrders);

  const result = (Number(completedOrdersCount) / Number(allOrdersCount)) * 100;
  if (result > 0) {
    return result;
  }
  return 0;
}

export async function getTasksRemaining(userId: User["id"]) {
  const orders = await getOrdersByUserId(userId);

  const inProgressOrders = orders?.filter(
    (order) => order.orderStatus == OrderStatus.ACCEPTED,
  );

  const inProgressOrdersCount = inProgressOrders?.length;

  if (Number(inProgressOrdersCount) > 0) {
    return inProgressOrdersCount;
  }
  return 0;
  
  
}
