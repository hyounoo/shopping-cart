<<template>
  <div>
    <h1>Product List</h1>
    <img v-if="loading" src="https://i.imgur.com/JfPpwOA.gif">
    <ul v-if="!loading">
        <li v-for="product in products">{{product.title}} - {{product.price | currency}} ({{product.inventory}})
            <button @click="addProductToCart(product)">Add to cart</button>
        </li>
    </ul>
</div>

</template>

<script>
import store from '../store/index.js'

export default {
    data () {
        return {
            loading: false
        }
    },
    computed: {
        products () {
            return this.$store.getters.availableProducts            
        }
    },
    created ()    {
        this.loading = true
        this.$store.dispatch('fetchProducts').then(() => this.loading = false)
    },
    methods: {
        addProductToCart(product){
            this.$store.dispatch('addProductToCart', product)
        }
    }
};
</script>

<style>

</style>
