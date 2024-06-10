const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const ProductModel = require("../models/productSchema.js");

const resolvers = {
  Query: {
    products: async () => {
      try {
        return await ProductModel.find();
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
    product: async (_, { id }) => {
      try {
        return await ProductModel.findById(id);
      } catch (error) {
        throw new Error("Error fetching product: " + error.message);
      }
    },
  },
  Mutation: {
    addProduct: async (_, { category, productName, price, colors }) => {
      try {
        const newProduct = new ProductModel({ category, productName, price, colors });
        const savedProduct = await newProduct.save();
        pubsub.publish('PRODUCT_ADDED', savedProduct);

        return savedProduct;
      } catch (error) {
        throw new Error("Error adding product: " + error.message);
      }
    },
    updateProduct: async (_, { id, category, productName, price, colors }) => {
      try {
        return await ProductModel.findByIdAndUpdate(
          id,
          { category, productName, price, colors },
          { new: true }
        );
      } catch (error) {
        throw new Error("Error updating product: " + error.message);
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
          throw new Error("Product not found");
        }
        return "Product deleted successfully";
      } catch (error) {
        throw new Error("Error deleting product: " + error.message);
      }
    },
  },
  Subscription: {
  productAdded: {
    subscribe: () => pubsub.asyncIterator('PRODUCT_ADDED'),
    resolve: (payload) => {
      const { id, category, productName, price, colors } = payload;
      const message = `Hello user, a new product has been added: ${productName}`;
      return { id, category, productName, price, colors, message };
    },
  },
},

};

module.exports = { resolvers };
