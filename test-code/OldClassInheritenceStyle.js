/*
 * Backbone cart model
 *
 * (c) May 2011 - Goldeneaglecoin
 *
 * Author: Manuel Odendahl - wesen@ruinwesen.com
 */



/**
 * @class App.Classes.Cart
 * @extends App.Classes.Order
 */
App.Classes.Cart = App.Classes.Order.extend(
  /** @lends App.Classes.Cart */
  {
    jsonFieldName: "cart",
  
    url: function () {
      return site + "rest/member/cart/extended";
    },
  
    /**
     * add products to the cart.
     **/
    addToCart: function (products) {
      var that = this;
      /* return the promise for the POST and parsing of JSON */
      var res = App.POST("rest/member/cart", { "products": products } )
        .then(function (res) {
          that.set(res.cart);
          if (res.cartItems && (res.cartItems.length > 0)) {
            that.trigger("added", res);
          }
        });
  
      return res;
    },
  
    checkQuantity: function (productId, quantity, maxAvail, inventoryType) {
      /* do some validation */
      if (!isPositiveNumber(quantity)) {
        /* XXX replace with sensible popup */
        App.notifyError("Please Enter a Valid Product Quantity.");
        return false;
      }
  
      if (inventoryType === 'NO_STOCK') {
        /* do nothing, on order product, always present */
        return true;
      } else if (inventoryType === 'STOCK') {
        var product = this.getCartProduct(productId);
        if (product) {
          maxAvail -= product.quantity;
        }
  
        if (maxAvail <= 0) {
          /* XXX replace with sensible popup */
          App.notifyError("You already have selected the maximum possible quantity of this item.");
          return false;
        }
  
        /* XXX replace with sensible popup */
        if ((quantity > maxAvail) && (maxAvail > 0)) {
          App.notifyError("We currently have " + maxAvail + " of this item in stock.");
          return false;
        }
      } else {
        debugLog("invalid inventoryType " + inventoryType);
        return false;
      }
  
      return true;  },
  
    deleteFromCart: function (id, quantity) {
      var that = this;
  
      if (quantity !== undefined) {
        var product = this.getCartProduct(id);
        if ((product.quantity - quantity) > 0) {
          return this.updateCart([{productId: id, quantity: product.quantity - quantity}]);
        }
        // else just remove it entirely
      }
  
      return App.DELETE("rest/member/cart/" + id)
      .then(function (res) {
        if (res.deletedItems && (res.deletedItems.length > 0)) {
          that.trigger("removed", res.cartItems);
        }
        that.set(res.cart);
      });
  
    },
  
    updateCart: function (products) {
      var that = this;
      return App.PUT("rest/member/cart", { products: products })
        .then(function (res) {
          if (res.cartItems && (res.cartItems.length > 0)) {
            that.trigger("updated", res.cartItems);
          }
          that.set(res.cart);
        });
    },
  
    refresh: function () {
      return App.GET("rest/member/cart/refresh");
    },
  
    getCartProduct: function (id) {
      var cart = this.get("positions");
      return _.detect(cart, function (p) { return p.productId == id; });
    },
  
    toJSON: function () {
      var data = App.Classes.Model.prototype.toJSON.apply(this);
      data.orderId = data.id;
      data.isPickup = this.get("shippingMethodId") == "PICKUP";
      data.positionsCount = this.positions ? this.positions.length : 0;
  
      if (data.isPickup) {
        data.shipToAlternateShipping = false;
      }
      if (this.payment) {
        data.payment = this.payment.toJSON();
  
        if (!data.payment.canShipToAlternateShipping) {
          data.shipToAlternateShipping = false;
        }
  
        if (!data.payment.canShipToAlternateShipping && !data.payment.canShipToBilling) {
          data.isPickup = true;
        }
      }
  
      this.formatPrices(data, ["total", "paymentCosts", "shipping", "taxes", "discount", "subtotal"]);
      this.formatDates(data, ["createdAt"]);
      return data;
    },
  
    getPaymentMethodsJSON: function () {
      var quantity = this.get("quantity");
      var subtotal = this.get("subtotal");
  
      var paymentMethodId = this.payment.get("paymentMethodId") || "PERSONAL_CHECK";
      if (App.Data.PaymentMethods) {
        return App.Data.PaymentMethods.map(
        function (elt) {
          /** @var {App.Classes.PaymentMethod} elt */
          var data = elt.toJSON();
          if (elt.id === paymentMethodId) {
            data.selected = true;
          }
  
          if (!elt.isValid(subtotal)) {
            data.disabled = true;
          } else {
            data.disabled = false;
          }
  
          if ((elt.id === "CREDIT_CARD") ||
              (elt.id === "PAYPAL")) {
            data.isCcPaypal = true;
          } else {
            data.isCcPaypal = false;
          }
  
          data.paymentCost = elt.getTransactionCosts(subtotal);
          data.paymentCostFormat = data.paymentCost.toDollars();
  
          return data;
        });
      }
    }
  
  });
  