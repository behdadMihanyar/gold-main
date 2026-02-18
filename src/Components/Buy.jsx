import React, { useEffect, useState } from "react";
import { useDataContext } from "../Context/DataContext";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import supabase from "../supabase";
import { ToastContainer } from "react-toastify";
import {
  handleCancel,
  handleDelete,
  handleEdit,
  handleEditChange,
  handleUpdate,
  handleDateChange,
} from "../utils/buyUpdate.js";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
const Buy = () => {
  //States for buy
  const [ordersBuy, setOrdersBuy] = useState([]);
  const [loadingBuy, setLoadingBuy] = useState(true);
  const [errorBuy, setErrorBuy] = useState(null);
  const [allBuy, setAllBuy] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [editingIdBuy, setEditingIdBuy] = useState(null);
  const [calendarVisibleBuy, setCalendarVisibleBuy] = useState(false);
  const [editFormDataBuy, setEditFormDataBuy] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    date: "",
    total: "",
    delivery: "",
    status: "",
  });

  //Context
  const {
    isMobile,
    setIsMobile,
    pagebuy,
    setPagebuy,
    totalCount,
    setTotalCount,
    page,
    setPage,
    totalCountBuy,
    setTotalCountBuy,
  } = useDataContext();

  //Buy tables from supabase
  const PAGE_SIZE_BUY = 5;
  const fetchOrdersBuy = async () => {
    setLoadingBuy(true);
    const from = (pagebuy - 1) * PAGE_SIZE_BUY;
    const to = from + PAGE_SIZE_BUY - 1;

    const { data, count, error } = await supabase
      .from("buy")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    } else {
      setOrdersBuy(data || []);
      setTotalCountBuy(count);
      setLoadingBuy(false);
    }
  };
  const totalPagesBuy = Math.ceil(totalCountBuy / PAGE_SIZE_BUY);

  useEffect(() => {
    fetchOrdersBuy();
    getBuyDate();
  }, [pagebuy]);

  //total coins bought
  const getBuyDate = async () => {
    const createToady = new DateObject({
      calendar: persian,
      locale: persian_fa,
    });
    const getToday = createToady.format("YYYY/MM/DD");
    const { data, error } = await supabase
      .from("buy")
      .select("*")
      .eq("date", getToday);
    if (error) {
      console.log(error.message);
      return;
    }
    setAllBuy(data);
  };
  const kol = allBuy.map((item) => Number(item.quantity));
  const totalCoinsSold = kol.reduce((sum, num) => sum + num, 0);

  useEffect(() => {
    const fetchTodayPrices = async () => {
      const createToady = new DateObject({
        calendar: persian,
        locale: persian_fa,
      });
      const getToday = createToady.format("YYYY/MM/DD");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      console.log(getToday);
      const { data, error } = await supabase
        .from("buy")
        .select("*")
        .eq("date", getToday);

      if (error) {
        console.error(error);
        return;
      }
      console.log(data);
      // Convert text to number and sum
      const before = data;
      const total = data.reduce((acc, row) => {
        if (!row.total) return acc;
        // Remove all non-digit characters
        const numericPrice = Number(row.total.replace(/\D/g, ""));
        return acc + (isNaN(numericPrice) ? 0 : numericPrice);
      }, 0);

      setTotalPrice(total);
    };

    fetchTodayPrices();
  }, []);
  return (
    <div>
      <div className="max-w-7xl mx-auto mt-10">
        <div className="flex justify-center gap-25 flex-row items-center ">
          {/* <img src={gold} alt="gold" width={125} height={125} /> */}
          <h2 className="font-bold text-gray-600 mb-8 text-center bg-yellow-500 p-3 rounded-2xl ">
            تعداد کل : {totalCoinsSold} سکه
          </h2>
          <h2 className="text- font-bold text-gray-800 mb-8 text-center text-shadow-lg ">
            - لیست خرید -
          </h2>
          <h2 className="font-bold text-gray-600 mb-8 text-center bg-yellow-500 p-3 rounded-2xl ">
            مبلغ کل : {totalPrice.toLocaleString()}
          </h2>
        </div>

        {ordersBuy.length === 0 ? (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center">
            <p className="text-xl text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-yellow-500 txt-xs to-orange-500 text-white">
                  <tr>
                    <th className="px-6 max-sm:py-1 py-3 text-center">نام</th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">تعداد</th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">نرخ</th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">
                      جمع کل
                    </th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">تاریخ</th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">
                      تحویل دهنده
                    </th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">
                      توضیحات
                    </th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">وضعیت</th>
                    <th className="px-6 max-sm:py-1 py-3 text-center">
                      عملیات
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 max-sm:text-sm">
                  {ordersBuy.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      {editingIdBuy === order.id ? (
                        <>
                          <td className="px-6 py-4 text-center">
                            <input
                              name="name"
                              value={editFormDataBuy.name}
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  setEditFormDataBuy,
                                  editFormDataBuy,
                                )
                              }
                              className="w-full border rounded px-2 py-1 text-sm text-center"
                            />
                          </td>

                          <td className="px-6 py-4 text-center">
                            <input
                              name="quantity"
                              value={editFormDataBuy.quantity}
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  setEditFormDataBuy,
                                  editFormDataBuy,
                                )
                              }
                              className="w-full border rounded px-2 py-1 text-sm text-center"
                            />
                          </td>

                          <td className="px-6 py-4 text-center">
                            <input
                              name="price"
                              value={editFormDataBuy.price}
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  setEditFormDataBuy,
                                  editFormDataBuy,
                                  setCalendarVisibleBuy,
                                )
                              }
                              className="w-full border rounded px-2 py-1 text-sm text-center"
                            />
                          </td>

                          <td className="px-6 py-4 text-center">
                            <input
                              value={editFormDataBuy.total}
                              readOnly
                              className="w-full bg-gray-100 border rounded px-2 py-1 text-sm text-center"
                            />
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div
                              onClick={() =>
                                setCalendarVisibleBuy(!calendarVisibleBuy)
                              }
                              className="cursor-pointer"
                            >
                              {editFormDataBuy.date
                                ? editFormDataBuy.date
                                : order.date}
                            </div>

                            {calendarVisibleBuy && (
                              <Calendar
                                calendar={persian}
                                locale={persian_fa}
                                value={editFormDataBuy.date}
                                onChange={(e) =>
                                  handleDateChange(
                                    e,
                                    setEditFormDataBuy,
                                    editFormDataBuy,
                                    setCalendarVisibleBuy,
                                  )
                                }
                              />
                            )}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <input
                              name="delivery"
                              value={editFormDataBuy.delivery}
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  setEditFormDataBuy,
                                  editFormDataBuy,
                                )
                              }
                              className="w-full border rounded px-2 py-1 text-sm text-center"
                            />
                          </td>

                          <td className="px-6 py-4 text-center">
                            <input
                              name="description"
                              value={editFormDataBuy.description}
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  setEditFormDataBuy,
                                  editFormDataBuy,
                                )
                              }
                              className="w-full border rounded px-2 py-1 text-sm text-center"
                            />
                          </td>

                          <td className="px-6 py-4 text-center">
                            <select
                              name="status"
                              value={editFormDataBuy.status}
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  setEditFormDataBuy,
                                  editFormDataBuy,
                                )
                              }
                              className="border rounded px-2 py-1 text-sm"
                            >
                              <option value="تسویه نشده">تسویه نشده</option>
                              <option value="پرداخت شده">پرداخت شده</option>
                              <option value="تحویل شده">تحویل شده</option>
                            </select>
                          </td>

                          <td className="px-6 py-4 text-center flex justify-center">
                            <button
                              onClick={(e) =>
                                handleUpdate(
                                  order.id,
                                  setEditingIdBuy,
                                  editFormDataBuy,
                                  setOrdersBuy,
                                  ordersBuy,
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              ذخیره
                            </button>

                            <button
                              onClick={() =>
                                handleCancel(
                                  setEditingIdBuy,
                                  setCalendarVisibleBuy,
                                  setEditFormDataBuy,
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                            >
                              X بستن
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.name}
                          </td>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.quantity}
                          </td>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.price}
                          </td>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.total}
                          </td>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.delivery || "-"}
                          </td>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.description || "-"}
                          </td>
                          <td className="px-6 py-4 text-center max-sm:p-3">
                            {order.status || "-"}
                          </td>

                          <td className="px-6 py-4 text-center max-sm:p-3">
                            <div className="flex items-center justify-center gap-2">
                              {/* Edit Button */}
                              <button
                                onClick={() =>
                                  handleEdit(
                                    order,
                                    setEditingIdBuy,
                                    setEditFormDataBuy,
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                ویرایش
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() =>
                                  handleDelete(
                                    order.id,
                                    ordersBuy,
                                    setOrdersBuy,
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                حذف
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="mt-2 flex justify-center gap-3">
          <button
            disabled={pagebuy === 1}
            onClick={() => setPagebuy((prev) => prev - 1)}
          >
            <GrLinkNext />
          </button>

          <span>
            {" "}
            {pagebuy} از {totalPagesBuy}{" "}
          </span>

          <button
            disabled={pagebuy === totalPagesBuy}
            onClick={() => setPagebuy((prev) => prev + 1)}
          >
            <GrLinkPrevious />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buy;
