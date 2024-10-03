import {
  FaHome,
  FaBoxOpen,
  FaHandshake,
  FaFileInvoice,
  FaChartBar,
} from "react-icons/fa";

export const adminMenu = [
  {
    name: "Tổng quan",
    icon: <FaHome />,
    menus: [
      {
        name: "menu.system.system-administrator.header",
        link: "/system/colum",
      },
    ],
  },
  {
    name: "Hàng hóa",
    icon: <FaBoxOpen />,
    menus: [
      {
        name: "Danh mục",
        link: "/system/product",
      },
      {
        name: "Kiểm kho",
        link: "/system/stock-check",
      },
    ],
  },
  {
    name: "Giao dịch",
    icon: <FaFileInvoice />,
    menus: [
      {
        name: "Hóa đơn",
        link: "/system/sale",
      },
      {
        name: "Nhập hàng",
        link: "/system/purchase",
      },
    ],
  },
  {
    name: "Đối tác",
    icon: <FaHandshake />,
    menus: [
      {
        name: "Khách hàng",
        link: "/system/customer",
      },
      {
        name: "Nhà cung cấp",
        link: "/system/supplier",
      },
    ],
  },
  {
    name: "Báo cáo",
    icon: <FaChartBar />,
    menus: [
      {
        name: "Hàng hóa",
        link: "/system/product-report",
      },
      {
        name: "Khách hàng",
        link: "/system/customer-report",
      },
      {
        name: "Nhà cung cấp",
        link: "/system/supplier-report",
      },
    ],
  },
];

export const adminMenuSale = [
  {
    name: "Bán hàng",
    icon: <FaFileInvoice />,
    menus: [
      {
        name: "Hóa đơn",
        link: "/system/sale-new",
      },
    ],
  },
];
