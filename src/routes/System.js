import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import ProductManage from "../containers/System/Product/ProductManage";
import CustomerManage from "../containers/System/Customer/CustomerManage";
import SupplierManage from "../containers/System/Supplier/SupplierManage";
import PurchaseManage from "../containers/System/Purchase/PurchaseManage";
import PurchaseNew from "../containers/System/Purchase/PurchaseNew";
import PurchaseUpdate from "../containers/System/Purchase/PurchaseUpdate";
import SaleNew from "../containers/System/Sale/SaleNew";
import SaleManage from "../containers/System/Sale/SaleManage";
import SaleUpdate from "../containers/System/Sale/SaleUpdate";
import Colum from "../containers/System/Colum/Colum";
import ProductReport from "../containers/System/Report/ProductReport";
import CustomerReport from "../containers/System/Report/CustomerReport";
import SupplierReport from "../containers/System/Report/SupplierReport";
import StockCheck from "../containers/System/Stock/StockCheck";
import StockCheckAdd from "../containers/System/Stock/StockCheckAdd";
import StockCheckUpdate from "../containers/System/Stock/StockCheckUpdate";
import RegisterPackageGroupOrAcc from "../containers/System/RegisterPackageGroupOrAcc";

class System extends Component {
  render() {
    const { systemMenuPath } = this.props;
    return (
      <div className="system-container">
        <div className="system-list">
          <Switch>
            <Route path="/system/colum" component={Colum} />
            <Route path="/system/user-manage" component={UserManage} />
            <Route path="/system/product" component={ProductManage} />
            <Route path="/system/customer" component={CustomerManage} />
            <Route path="/system/supplier" component={SupplierManage} />
            <Route path="/system/purchase" component={PurchaseManage} />
            <Route path="/system/purchase-new" component={PurchaseNew} />
            <Route path="/system/purchase-update" component={PurchaseUpdate} />
            <Route path="/system/sale-new" component={SaleNew} />
            <Route path="/system/sale" component={SaleManage} />
            <Route path="/system/sale-update" component={SaleUpdate} />
            <Route path="/system/product-report" component={ProductReport} />
            <Route path="/system/customer-report" component={CustomerReport} />
            <Route path="/system/supplier-report" component={SupplierReport} />
            <Route path="/system/stock-check" component={StockCheck} />
            <Route path="/system/stock-check-add" component={StockCheckAdd} />
            <Route
              path="/system/stock-check-update"
              component={StockCheckUpdate}
            />

            <Route
              path="/system/register-package-group-or-account"
              component={RegisterPackageGroupOrAcc}
            />

            <Route
              component={() => {
                return <Redirect to={systemMenuPath} />;
              }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
