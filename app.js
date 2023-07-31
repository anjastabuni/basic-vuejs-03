Vue.component("price", {
  data: function () {
    return {};
  },
  props: {
    value: Number,
    prefix: {
      type: String,
      default: "Rp",
    },
    precision: {
      type: Number,
      default: 2,
    },
  },
  template: "<span>{{ this.prefix + Number.parseFloat(this.value).toFixed(this.precision) }}</span>",
});

Vue.component("product-list", {
  props: ["products", "maximum"],
  methods: {
    before: function (el) {
      el.className = "d-none";
    },
    enter: function (el) {
      var delay = el.dataset.index * 100;
      setTimeout(function () {
        el.className = "row d-flex mb-3 align-items-center animated fadeInRight";
      }, delay);
    },
    leave: function (el) {
      var delay = el.dataset.index * 100;
      setTimeout(function () {
        el.className = "row d-flex mb-3 align-items-center animated fadeOutRight";
      }, delay);
    },
  },
  template: ` 
        <transition-group name="fade" tag="div" @beforeEnter="before" @enter="enter" @leave="leave">
          <div class="row d-none mb-3 align-items-center" v-for="(item, index) in products" :key="item.id" v-if="item.price <= Number(maximum)" :data-index="index">

            <div class="col-1">
              <button class="btn btn-info" @click="$emit('add', item)">+</button>
            </div>
              <div class="col-sm-4">
                <img class="img-fluid d-block" v-bind:src="item.image" :alt="item.name" />
              </div>
              <div class="col">
                <h2 class="text-info">{{ item.name }}</h2>
                <p class="mb-0">{{ item.description }}</p>
                <div class="h5 pt-2"> 
                  <price :value="Number(item.price)"
                    :prefix="'$'"
                    :precision="3"
                    ></price>
                </div>
              </div>
              
            </div>
      </transition-group>
  `,
});

var app = new Vue({
  el: "#app",
  data: {
    maximum: 50,
    products: null,
    cart: [],
    style: {
      label: ["font-weight-bold", "mr-2"],
      inputWidth: 60,
      sliderStatus: true,
    },
  },
  mounted: function () {
    fetch("https://hplussport.com/api/products/order/price")
      .then((Response) => Response.json())
      .then((data) => {
        this.products = data;
      });
  },
  filters: {
    currencyFormat: function (value) {
      return "Rp" + Number.parseFloat(value).toFixed(2);
    },
  },
  computed: {
    sliderState: function () {
      return this.style.sliderStatus ? "d-flex" : "d-none";
    },
    cartTotal: function () {
      let sun = 0;
      for (key in this.cart) {
        sun = sun + (this.cart[key].product.price + this.cart[key].qty);
      }
      return sun;
    },
    cartQty: function () {
      let qty = 0;
      for (key in this.cart) {
        qty = qty + this.cart[key].qty;
      }
      return qty;
    },
  },
  methods: {
    addItem: function (product) {
      var productIndex;
      var productExist = this.cart.filter(function (item, index) {
        if (item.product.id == Number(product.id)) {
          productIndex = index;
          return true;
        } else {
          return false;
        }
      });
      if (productExist.length) {
        this.cart[productIndex].qty++;
      } else {
        this.cart.push({ product: product, qty: 1 });
      }
    },
    deleteItem: function (id) {
      if (this.cart[key].qty > 1) {
        this.cart[key].qty--;
      } else {
        this.cart.splice(key, 1);
      }
    },
  },
});
