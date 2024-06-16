export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  const itemsPrice = state.cartItems.reduce(
    (acc, item) =>
      item.salePrice !== 0
        ? acc + item.salePrice * item.qty
        : acc + item.sellPrice * item.qty,
    0
  );

  state.itemsPrice = addDecimals(itemsPrice);

  const shippingPrice = itemsPrice > 100 ? 15 : 0;
  state.shippingPrice = addDecimals(shippingPrice);

  const taxPrice = 0.0875 * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
