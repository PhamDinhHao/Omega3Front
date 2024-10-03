import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import appReducer from "./appReducer";
import adminReducer from "./adminReducer";
import userReducer from "./userReducer";
import supplierReducer from "./supplierReducer";
import customerReducer from "./customerReducer";
import productReducer from "./productReducer";
import purchaseReducer from "./purchaseReducer";
import saleReducer from "./saleReducer";
import stockReducer from "./stockReducer";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistCommonConfig = {
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
  ...persistCommonConfig,
  key: "user",
  whitelist: ["isLoggedIn", "userInfo"],
};

export default (history) =>
  combineReducers({
    router: connectRouter(history),

    user: persistReducer(userPersistConfig, userReducer),

    app: appReducer,
    supplier: supplierReducer,
    customer: customerReducer,
    product: productReducer,
    purchase: purchaseReducer,
    sale: saleReducer,
    stock: stockReducer,
  });
