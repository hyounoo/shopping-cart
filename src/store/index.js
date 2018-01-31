import Vuex from 'vuex'
import Vue from 'vue'
import shop from '../api/shop'
Vue.use(Vuex)

export default new Vuex.Store({
  state: { // = data
    products: [],
    // {id, quantity}
    cart: [],
    checkoutStatus: null
  },
  getters: { // = computed properties
    availableProducts(state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },
    cartProducts (state, getters){
        return state.cart.map(cartItem =>{
            const product = state.products.find(product => product.id === cartItem.id)

            return{
                title: product.title,
                price: product.price,
                quantity: cartItem.quantity
            }            
        })
    },
    cartTotal(state, getters){
        // let total = 0
        // getters.cartProducts.forEach(product => {
        //     total += product.price * product.quantity            
        // })
        // return total

        return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)

    }
  },
  actions: {
    fetchProducts({ commit }) {
      return new Promise((resolve, reject) => {
        // make the call
        // run setProducts mutation
        shop.getProducts(p => {
          commit('setProducts', p)
          resolve()
        })
      })
    },
    addProductToCart(context, product) {
      if (product.inventory > 0) {
        const cartItem = context.state.cart.find(item => item.id === product.id)

        // find cartItem
        if (!cartItem) {
          // pushProcutctToCart
          context.commit('pushProductToCart', product.id)
        } else {
          // incrementItemQuantity
          context.commit('incrementItemQuantity', cartItem)
        }

        context.commit('decrementProductInventory', product)
      }
    },
    checkout ({state, commit}){
        shop.buyProducts(
            state.cart, () => {
                commit('emptyCart')
                commit('setCheckoutStatus', 'success')
            },
            () => {
                commit('setCheckoutStatus', 'fail')
            }
        )
    }
  },
  mutations: {
    setProducts(state, products) {
      // update products
      state.products = products
    },

    pushProductToCart(state, id){
        state.cart.push({
            id: id,
            quantity: 1
        })        
    },
    incrementItemQuantity(state, cartItem){
        cartItem.quantity++
    },
    decrementProductInventory(state, cartItem){
        cartItem.inventory--
    },
    setCheckoutStatus(state, status){
        state.checkoutStatus = status
    },
    emptyCart(state){
        state.cart = []
    }
    
  }
})
