import { ActorSystem } from "tarant";
import { ActionsProtocol, Actions } from "../../lib/actions";
import { Shop } from "../../lib/domain/shop";

const ALL_PRODUCTS = {}

describe('Actions', () => {
    let system: ActorSystem
    let protocol: ActionsProtocol
    let shop: Shop
    let actions: Actions
    
    beforeEach(() => {
        system = ActorSystem.default()
        protocol = {
            onCheckout: jest.fn(),
            onAddToCart: jest.fn(),
            onRetrievedAllProducts: jest.fn()
        } as unknown as any
        shop = {
            retrieveAllProducts: jest.fn().mockReturnValue(Promise.resolve(ALL_PRODUCTS))
        } as unknown as any
        actions = system.actorOf(Actions, [protocol, shop])
    })

    afterEach(() => {
        system.free()
    })

    test('that getAll propagates the list of products', async () => {
        await actions.getAll()

        expect(shop.retrieveAllProducts).toHaveBeenCalled()
        expect(protocol.onRetrievedAllProducts).toHaveBeenCalledWith({})
    })

    test('that addToCart propagates the item to add', () => {
        const item = 'xxx'

        actions.addToCart(item)
        protocol.onAddToCart(item)
    })

    test('that checkout propagates the checkout', () => {
        actions.checkout()
        protocol.onCheckout()
    })
})