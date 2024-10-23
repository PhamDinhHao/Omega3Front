import React, { Component, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import ModelNewProduct from "./ModelNewProduct";
import ModelUpdateProduct from "./ModelUpdateProduct";
import "./ProductManage.scss";
import Select from "react-select";
import { Divider, Radio, Table } from "antd";
import { getProductDoneSale } from "../../../services/productService";
import { reduce, template } from "lodash";
import { emitter } from "../../../utils/emitter";
import { getAllCategory, getAllLocation } from "../../../services/categoryService";
import Checkbox from "antd/es/checkbox/Checkbox";
import CustomScrollbars from "../../../components/CustomScrollbars";
import Lightbox from "react-image-lightbox";

class ProductManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productRedux: [],

      isOpenNewProduct: false,
      isOpenModalEditProduct: false,
      productEdit: {},

      listProduct: [],
      selectedProduct: [],

      tempProduct: [],

      arrCategorys: [],
      selectedItemCheckbox: [],
      arrLocation: [],
      columns: [
        {
          title: "Tên sản phẩm",
          dataIndex: "productName",
          render: (text) => <a>{text}</a>,
        },
        {
          title: "Hình ảnh",
          dataIndex: "image",
          render: (imageBase64) => {
            const imageBinary = Buffer.from(imageBase64, "base64").toString(
              "binary"
            );

            return (
              <img
                src={imageBase64}
                alt="Product"
                style={{ width: 36, height: 38 }}
                onClick={() => this.handleImageClick(imageBinary)}
              />
            );
          },
        },
        {
          title: "Số lượng",
          dataIndex: "quantity",
          render: (text) => this.formatNumberWithCommas(text),
        },
        {
          title: "Giá nhập",
          dataIndex: "costPrice",
          render: (text) => this.formatNumberWithCommas(text),
        },
        {
          title: "Giá bán",
          dataIndex: "salePrice",
          render: (text) => this.formatNumberWithCommas(text),
        },
        {
          title: "Hoạt động",
          dataIndex: "",
          render: (text, record) => (
            <div>
              <button
                className="btn-edit"
                onClick={() => this.handleUpdateProduct(record)}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button
                className="btn-delete"
                onClick={() => this.handleDeleteProduct(record)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ),
        },
      ],
      isOpen: false,
      previewImgUrl: "",
    };
  }

  handleImageClick = (dataImage) => {
    this.setState({
      isOpen: true,
      previewImgUrl: dataImage,
    });
  };
  handleSelectionTypeChange = (e) => {
    this.setState({
      selectionType: e.target.value,
    });
  };
  toggleProductModal = () => {
    this.setState({
      isOpenNewProduct: !this.state.isOpenNewProduct,
    });
  };

  async componentDidMount() {
    this.props.fetchProductRedux();
    await this.getAllCategoryFromReact();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listproducts !== this.props.listproducts) {
      let dataSelect = this.buildDataInputSelect(this.props.listproducts);
      this.setState({
        productRedux: this.props.listproducts,
        listProduct: dataSelect,
      });
    }
    // if (prevState.selectedItemCheckbox !== this.state.selectedItemCheckbox) {
    //   this.setState({
    //     productRedux: this.state.selectedItemCheckbox
    //   })
    // }
  }
  handleChangeSelect = async (selectedProduct) => {
    this.setState({ selectedProduct: selectedProduct });
  };

  buildDataInputSelect = (inputData) => {
    let result = [];

    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.productName;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  handleAddNewProduct = () => {
    this.setState({
      isOpenNewProduct: true,
    });
  };

  createNewProduct = async (data) => {
    try {
      let response = await this.props.createNewProductRedux(data);

      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({
          isOpenNewProduct: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteProduct = (product) => {
    // e.preventDefault();
    this.props.deleteProductRedux(product.id);
  };

  handleUpdateProduct = (product) => {
    this.setState({
      isOpenModalEditProduct: true,
      productEdit: product,
    });
  };

  toggleProductEditModal = () => {
    this.setState({
      isOpenModalEditProduct: !this.state.isOpenModalEditProduct,
    });
  };

  doEditProduct = async (product) => {
    try {
      let response = await this.props.editProductRedux(product);
      if (response && response.errCode !== 0) {
        alert(response.errCode);
      } else {
        this.setState({
          isOpenModalEditProduct: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  getAllCategoryFromReact = async () => {
    let response = await getAllCategory("ALL");
    let response1 = await getAllLocation("ALL");

    if (response && response.errCode == 0) {
      this.setState({
        arrCategorys: response.categorys,
      });
    }
    if (response1 && response1.errCode == 0) {
      this.setState({
        arrLocation: response1.lacations,
      });
    }
  };

  filterProducts = (products, selectedOption) => {
    if (selectedOption === null) return products;
    if (selectedOption.length === 0) return products;
    return products.filter((product) => product.id === selectedOption.value);
  };

  handleSearchByCategory = (data) => {
    const foundItems = this.state.productRedux.filter(
      (item) => item.categoryId === data.id
    );

    if (foundItems.length > 0) {
      const isAlreadySelected = foundItems.some((item) => {
        return this.state.selectedItemCheckbox.some(
          (selectedItem) => selectedItem.categoryId === item.categoryId
        );
      });

      if (isAlreadySelected) {
        this.setState((prevState) => ({
          selectedItemCheckbox: prevState.selectedItemCheckbox.filter(
            (item) => item.categoryId !== data.id
          ),
        }));
      } else {
        this.setState((prevState) => ({
          selectedItemCheckbox: [
            ...prevState.selectedItemCheckbox,
            ...foundItems,
          ],
        }));
      }
    } else {
      console.log("Không tìm thấy mục với id:", data.id);
    }
  };

  handleSearchByLocation = (data) => {
    console.log("check aaa", data);
    const foundItems = this.state.productRedux.filter(
      (item) => item.locationId === data.id
    );

    if (foundItems.length > 0) {
      const isAlreadySelected = foundItems.some((item) => {
        return this.state.selectedItemCheckbox.some(
          (selectedItem) => selectedItem.locationId === item.locationId
        );
      });

      if (isAlreadySelected) {
        this.setState((prevState) => ({
          selectedItemCheckbox: prevState.selectedItemCheckbox.filter(
            (item) => item.locationId !== data.id
          ),
        }));
      } else {
        this.setState((prevState) => ({
          selectedItemCheckbox: [
            ...prevState.selectedItemCheckbox,
            ...foundItems,
          ],
        }));
      }
    } else {
      console.log("Không tìm thấy mục với id:", data.id);
    }
  };
  searchByCheckBoxOrInputSearch = () => {
    let tempList = [];

    if (this.state.selectedItemCheckbox.length > 0) {
      tempList = this.state.selectedItemCheckbox;
    } else {
      tempList = this.filterProducts(
        this.state.productRedux,
        this.state.selectedProduct
      );
    }

    return tempList;
  };

  formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const filteredProducts = this.searchByCheckBoxOrInputSearch();
    let { checkedList, arrCategorys, arrLocation } = this.state;

    return (
      <div className="product">
        <div className="product-content">
          <div className="main-left">
            <div className="category">
              <div className="heading-page">
                <span className="ng-binding">Hàng hóa</span>
              </div>

              <div className="checkbox-fillList">
                <label style={{ fontWeight: "600" }}>Loại hàng hóa</label>
                {arrCategorys &&
                  arrCategorys.length > 0 &&
                  arrCategorys.map((item, index) => {
                    return (
                      <Checkbox
                        className="check-box"
                        key={index}
                        onClick={() => this.handleSearchByCategory(item)}
                      >
                        {item.categoryName}
                      </Checkbox>
                    );
                  })}
              </div>

            </div>
            <div className="category">

              <div className="checkbox-fillList">
                <label style={{ fontWeight: "600" }}>Vị trí</label>
                {arrLocation &&
                  arrLocation.length > 0 &&
                  arrLocation.map((item, index) => {
                    return (
                      <Checkbox
                        className="check-box"
                        key={index}
                        onClick={() => this.handleSearchByLocation(item)}
                      >
                        {item.locationName}
                      </Checkbox>
                    );
                  })}
              </div>

            </div>

          </div>
          <div className="main-right">
            <div className="mainWrap">
              <div className="header-filter">
                <div className="header-filter-search">
                  <Select
                    classNamePrefix="select"
                    placeholder={"Search"}
                    isClearable
                    value={this.state.selectedProduct}
                    onChange={this.handleChangeSelect}
                    options={this.state.listProduct}
                  />
                </div>
                <div className="header-filter-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => this.handleAddNewProduct()}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>
              <div className="product-list">
                <ModelNewProduct
                  isOpen={this.state.isOpenNewProduct}
                  toggleFromParent={this.toggleProductModal}
                  createNewProduct={this.createNewProduct}
                />
                {this.state.isOpenModalEditProduct && (
                  <ModelUpdateProduct
                    isOpen={this.state.isOpenModalEditProduct}
                    toggleFromParent={this.toggleProductEditModal}
                    currentProduct={this.state.productEdit}
                    editProduct={this.doEditProduct}
                  />
                )}

                <div className="suppliers-table mt-4">
                  <div>
                    <Table
                      pagination={{ pageSize: 10 }}
                      scroll={{ y: 700 }}
                      columns={this.state.columns}
                      dataSource={filteredProducts}
                      onRow={(record, rowIndex) => {
                        return {
                          // onClick: (event) => {
                          //   console.log("check record", record);
                          // }, // click row
                        };
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listproducts: state.product.products,
    listSuppliers: state.supplier.suppliers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProductRedux: (inputId) =>
      dispatch(actions.fetchAllProductsStart(inputId)),
    createNewProductRedux: (data) => dispatch(actions.createNewProduct(data)),
    deleteProductRedux: (id) => dispatch(actions.deleteProduct(id)),
    editProductRedux: (data) => dispatch(actions.editProduct(data)),
    createNewSupplierRedux: (data) => dispatch(actions.createNewSupplier(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
