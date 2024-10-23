import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
import ModelNewProduct from "../../System/Product/ModelNewProduct";
import { emitter } from "../../../utils/emitter";

class StockCheckUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productValue: "",
      productSuggestions: [],
      products: [],
      actualQuantities: {},
      quantityDifferences: {},
      moneyDifferences: {},
      isOpenNewProduct: false,
      selectedDate: new Date(),
      totalActualMoney: 0,
      totalMoneyDifference: 0,
      note: "",
      // stockCheckId: null,
    };
  }

  async componentDidMount() {
    const { state } = this.props.location;
    if (state && state.record) {
      const { record } = state;
      console.log(record);
      // await this.props.fetchProductBySaleIdRedux(record.id);
      this.setState({
        // Cập nhật state khác nếu cần thiết, ví dụ:
        totalActualMoney: record.totalActualMoney,
        totalMoneyDifference: record.totalMoneyDifference,
        note: record.note,

        // products: this.props.listProductBySaleId.data,
        selectedDate: new Date(record.checkDate),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.productSuggestions !== this.props.productSuggestions) {
      this.setState({ productSuggestions: this.props.productSuggestions });
    }
    if (prevProps.stockCheckId !== this.props.stockCheckId) {
      console.log("Updated stockCheckId:", this.props.stockCheckId);
      this.setState({ stockCheckId: this.props.stockCheckId });
    }
  }

  toggleProductModal = () => {
    this.setState({ isOpenNewProduct: !this.state.isOpenNewProduct });
  };

  handleReturnToPurchase = () => {
    this.props.history.push("/system/stock-check");
  };

  handleAddNewProduct = () => {
    this.setState({ isOpenNewProduct: true });
  };

  createNewProduct = async (data) => {
    try {
      let response = await this.props.createNewProductRedux(data);

      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({ isOpenNewProduct: false });
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getProductSuggestions = async (value) => {
    try {
      this.props.fetchProductSuggestionsRedux(value);
    } catch (error) {
      console.error("error fetching product suggestions", error);
    }
  };

  renderProductSuggestion = (suggestion) => <div>{suggestion.productName}</div>;

  onProductChange = (event, { newValue }) => {
    this.setState({ productValue: newValue });
    this.getProductSuggestions(newValue);
  };

  onProductSuggestionsFetchRequested = ({ value }) => {
    this.getProductSuggestions(value);
  };

  onProductSuggestionsClearRequested = () => {
    this.setState({ productSuggestions: [] });
  };

  onProductTableSuggestionSelected = (event, { suggestion }) => {
    const {
      products,
      actualQuantities,
      quantityDifferences,
      moneyDifferences,
    } = this.state;
    const existingProductIndex = products.findIndex(
      (product) => product.id === suggestion.id
    );

    if (existingProductIndex !== -1) {
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity++;
      this.setState({ products: updatedProducts });
    } else {
      const newProduct = {
        id: suggestion.id,
        name: suggestion.productName,
        quantity: suggestion.quantity,
        costPrice: suggestion.costPrice,
      };
      const newProducts = [...products, newProduct];
      this.setState({ products: newProducts });

      this.setState({
        actualQuantities: {
          ...actualQuantities,
          [suggestion.id]: suggestion.quantity,
        },
        quantityDifferences: {
          ...quantityDifferences,
          [suggestion.id]: 0,
        },
        moneyDifferences: {
          ...moneyDifferences,
          [suggestion.id]: 0,
        },
      });
    }
    this.setState({ productValue: "" });
  };

  onQuantityIncrease = (productId) => {
    this.setState((prevState) => {
      const product = prevState.products.find((p) => p.id === productId);
      if (!product) return null;

      const actualQuantities = {
        ...prevState.actualQuantities,
        [productId]: (prevState.actualQuantities[productId] || 0) + 1,
      };
      const originalQuantity = product.quantity;
      const quantityDifferences = {
        ...prevState.quantityDifferences,
        [productId]: actualQuantities[productId] - originalQuantity,
      };
      const costPrice = product.costPrice;
      const moneyDifferences = {
        ...prevState.moneyDifferences,
        [productId]: quantityDifferences[productId] * costPrice,
      };

      const totalActualMoney = this.getTotalActualMoney();
      const totalMoneyDifference = this.getTotalMoneyDifference();

      return {
        actualQuantities,
        quantityDifferences,
        moneyDifferences,
        totalActualMoney,
        totalMoneyDifference,
      };
    });
  };

  onQuantityDecrease = (productId) => {
    this.setState((prevState) => {
      const product = prevState.products.find((p) => p.id === productId);
      if (!product) return null;

      const actualQuantities = {
        ...prevState.actualQuantities,
        [productId]: Math.max(
          (prevState.actualQuantities[productId] || 0) - 1,
          0
        ),
      };
      const originalQuantity = product.quantity;
      const quantityDifferences = {
        ...prevState.quantityDifferences,
        [productId]: actualQuantities[productId] - originalQuantity,
      };
      const costPrice = product.costPrice;
      const moneyDifferences = {
        ...prevState.moneyDifferences,
        [productId]: quantityDifferences[productId] * costPrice,
      };

      const totalActualMoney = this.getTotalActualMoney();
      const totalMoneyDifference = this.getTotalMoneyDifference();

      return {
        actualQuantities,
        quantityDifferences,
        moneyDifferences,
        totalActualMoney,
        totalMoneyDifference,
      };
    });
  };

  onActualQuantityChange = (productId, value) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      this.setState((prevState) => {
        const product = prevState.products.find((p) => p.id === productId);
        if (!product) return null;

        const actualQuantities = {
          ...prevState.actualQuantities,
          [productId]: newQuantity,
        };
        const originalQuantity = product.quantity;
        const quantityDifferences = {
          ...prevState.quantityDifferences,
          [productId]: newQuantity - originalQuantity,
        };
        const costPrice = product.costPrice;
        const moneyDifferences = {
          ...prevState.moneyDifferences,
          [productId]: quantityDifferences[productId] * costPrice,
        };
        return { actualQuantities, quantityDifferences, moneyDifferences };
      });
    }
  };

  getTotalActualQuantity = () => {
    const { actualQuantities } = this.state;
    return Object.values(actualQuantities).reduce(
      (acc, quantity) => acc + quantity,
      0
    );
  };

  getTotalActualMoney = () => {
    const { actualQuantities, products } = this.state;
    let totalActualMoney = 0;
    products.forEach((product) => {
      const actualQuantity = actualQuantities[product.id] || 0;
      totalActualMoney += actualQuantity * product.costPrice;
    });
    return totalActualMoney;
  };

  getTotalMoneyDifference = () => {
    const { moneyDifferences } = this.state;
    let totalMoneyDifference = 0;
    Object.values(moneyDifferences).forEach((difference) => {
      totalMoneyDifference += difference;
    });
    return totalMoneyDifference;
  };

  onDeleteProduct = (index) => {
    const { products } = this.state;
    const updatedproducts = [...products];
    updatedproducts.splice(index, 1);
    this.setState({ products: updatedproducts });
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };

  saveStockCheckAndDetails = async (selectedDate) => {
    try {
      const {
        products,
        actualQuantities,
        quantityDifferences,
        moneyDifferences,
        note,
        totalActualMoney,
        totalMoneyDifference,
      } = this.state;

      if (products.length > 0) {
        await this.props.createNewStockCheckRedux({
          checkDate: selectedDate,
          totalActualQuantity: this.getTotalActualQuantity(),
          totalActualMoney: this.getTotalActualMoney(),
          totalMoneyDifference: this.getTotalMoneyDifference(),
          note,
        });

        const { stockCheckId } = this.props;
        console.log("Stock Check ID:", stockCheckId);

        await Promise.all(
          products.map(async (product) => {
            const { id: productId, quantity, costPrice } = product;
            await this.props.createStockCheckDetailRedux({
              stockCheckId: stockCheckId,
              productId: productId,
              actualQuantity: actualQuantities[productId],
              quantityDifference: quantityDifferences[productId],
              moneyDifference: moneyDifferences[productId],
            });
          })
        );

        console.log("Stock check and details saved successfully!");
        this.props.history.push("/system/stock-check");
      } else {
        alert("No products to check");
      }
    } catch (error) {
      console.error("Error saving stock check and details:", error);
    }
  };

  render() {
    const {
      productValue,
      productSuggestions,
      products = [],
      selectedDate,
      actualQuantities,
      quantityDifferences,
      moneyDifferences,
      note,
    } = this.state;

    const productInputProps = {
      placeholder: "Tìm sản phẩm",
      value: productValue,
      onChange: this.onProductChange,
    };

    return (
      <div class="cover-div">
        <div class="item-left">
          <div class="search-box">
            <div class="back-arrow">
              <button onClick={() => this.handleReturnToPurchase()}>
                <i class="fas fa-arrow-left"></i>
              </button>
            </div>
            <div class="search-bar">
              <button>
                <i class="fas fa-search icon"></i>
              </button>
              <div class="suggestion-container">
                <Autosuggest
                  suggestions={productSuggestions}
                  onSuggestionsFetchRequested={
                    this.onProductSuggestionsFetchRequested
                  }
                  onSuggestionsClearRequested={
                    this.onProductSuggestionsClearRequested
                  }
                  getSuggestionValue={(suggestion) => suggestion.productName}
                  renderSuggestion={this.renderProductSuggestion}
                  inputProps={productInputProps}
                  onSuggestionSelected={this.onProductTableSuggestionSelected}
                />
              </div>
              <button onClick={() => this.handleAddNewProduct()}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="item-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>STT</th>
                  <th>Id</th>
                  <th>Tên</th>
                  <th>Tồn Kho</th>
                  <th>Thực Tế</th>
                  <th>SL Lệch</th>
                  <th>Giá Trị Lệch</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => this.onDeleteProduct(index)}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "#B22222" }}
                        ></i>
                      </button>
                    </td>
                    <td>{index + 1}</td>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <button
                        className="quantity-btn"
                        onClick={() => this.onQuantityDecrease(product.id)}
                        disabled={actualQuantities[product.id] <= 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={actualQuantities[product.id]}
                        onChange={(e) =>
                          this.onActualQuantityChange(
                            product.id,
                            e.target.value
                          )
                        }
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => this.onQuantityIncrease(product.id)}
                      >
                        +
                      </button>
                    </td>
                    <td>{quantityDifferences[product.id]}</td>
                    <td>{moneyDifferences[product.id]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="product-list">
            <ModelNewProduct
              isOpen={this.state.isOpenNewProduct}
              toggleFromParent={this.toggleProductModal}
              createNewProduct={this.createNewProduct}
            />
          </div>
        </div>
        <div class="item-right">
          <div class="purchare-order">
            <div class="user-box">
              <div class="user-name">
                <span></span>
              </div>
              <div class="datetime-picker">
                <DatePicker
                  value={selectedDate}
                  onChange={this.handleDateChange}
                />
              </div>
            </div>
            <div class="quantity-box">
              <span>Tổng số lượng thực tế:</span>
              <span class="total-quantity">
                {this.getTotalActualQuantity()}
              </span>
            </div>
            <div class="money-box">
              <span>Tổng Tiền thực tế:</span>
              <span class="total-money">{this.getTotalActualMoney()}</span>
            </div>
            <div class="money-difference-box">
              <span>Tổng chênh lệch:</span>
              <span class="total-money-difference">
                {this.getTotalMoneyDifference()}
              </span>
            </div>
            <div class="note-box">
              <div class="note-input">
                <textarea
                  placeholder="ghi chú"
                  value={note}
                  onChange={(e) => this.setState({ note: e.target.value })}
                ></textarea>
              </div>
            </div>
            <div class="wrap-button">
              <a
                href="#"
                className="btn btn-success btn-font--medium"
                onClick={() => this.saveStockCheckAndDetails(selectedDate)}
              >
                <i class="fas fa-check"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productSuggestions: state.product.productSuggestions,
    stockCheckId: state.stock.stockCheckId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProductSuggestionsRedux: (value) =>
      dispatch(actions.fetchProductSuggestions(value)),
    createNewProductRedux: (data) => dispatch(actions.createNewProduct(data)),
    createNewStockCheckRedux: (data) =>
      dispatch(actions.createNewStockCheck(data)),
    createStockCheckDetailRedux: (data) =>
      dispatch(actions.createNewStockCheckDetail(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockCheckUpdate);
