import * as connection from "@notifications/queues/Connection";
import amqplib from "amqplib";
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from "@notifications/queues/email.consumer";

jest.mock("@notifications/queues/Connection");
jest.mock("amqplib");
jest.mock("@nitinthakurdev/jobber-package");

describe("Email consumer",() => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(()=> {
        jest.clearAllMocks();
    });

    describe("consumeAuthEmailMessages method",()=>{
         it("it should be called ", async ()=>{
            const channel = {
                assertExchange:jest.fn(),
                assertQueue:jest.fn(),
                bindQueue:jest.fn(),
                publish:jest.fn(),
                consume:jest.fn(),
            };
            jest.spyOn(channel,'assertExchange')
            jest.spyOn(channel,'bindQueue').mockReturnValue({queue: "auth-email-queue",messageCount:0,consumerCount:0});
            jest.spyOn(connection,"createConnection").mockReturnValue(channel as any);
            const connectionChannel:amqplib.Channel | undefined = await connection.createConnection();
            await consumeAuthEmailMessages(connectionChannel!)
            expect(connectionChannel!.assertExchange).toHaveBeenCalledWith("email-notification","direct")
            expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1)
            expect(connectionChannel!.consume).toHaveBeenCalledTimes(1)
            expect(connectionChannel!.bindQueue).toHaveBeenCalledWith("auth-email-queue","email-notification","auth-email")
         })
    });

     describe("consumeOrderEmailMessages method",()=>{
         it("it should be called ", async ()=>{
            const channel = {
                assertExchange:jest.fn(),
                assertQueue:jest.fn(),
                bindQueue:jest.fn(),
                publish:jest.fn(),
                consume:jest.fn(),
            };
            jest.spyOn(channel,'assertExchange')
            jest.spyOn(channel,'bindQueue').mockReturnValue({queue: "order-email-queue",messageCount:0,consumerCount:0});
            jest.spyOn(connection,"createConnection").mockReturnValue(channel as any);
            const connectionChannel:amqplib.Channel | undefined = await connection.createConnection();
            await consumeOrderEmailMessages(connectionChannel!)
            expect(connectionChannel!.assertExchange).toHaveBeenCalledWith("order-notification","direct")
            expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1)
            expect(connectionChannel!.consume).toHaveBeenCalledTimes(1)
            expect(connectionChannel!.bindQueue).toHaveBeenCalledWith("order-email-queue","order-notification","order-email")
         })
    });
})




