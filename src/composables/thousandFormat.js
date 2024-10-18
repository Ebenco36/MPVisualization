const currencyFormatter = (amount) => {
  return new Intl.NumberFormat().format(amount)
}

export default currencyFormatter;