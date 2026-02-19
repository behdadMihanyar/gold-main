import React, { useState } from "react";
import supabase from "./supabase";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ToastContainer, toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import {
  handleChange,
  handleDateChange,
  handleSubmit,
} from "./utils/sellRequest.js";
import {
  handleChangeBuy,
  handleDateChangeBuy,
  handleSubmitBuy,
} from "./utils/buyRequest.js";
import { defaultNames } from "../src/customers/customers.js";

const AddOrder = () => {
  //styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "0",
      borderBottom: "2px solid #D1D5DB", // gray-300
      borderRadius: "0",
      minHeight: "42px",
      boxShadow: "none",
      padding: "2px 0",
      "&:hover": {
        borderBottom: "2px solid #3B82F6", // blue-500
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#6B7280", // gray-500
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "transparent",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#111827", // gray-900
    }),
  };
  //  فروش
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    date: "",
    total: "",
    delivery: "",
  });
  // خرید
  const [formDataBuy, setFormDataBuy] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    date: "",
    total: "",
    delivery: "",
  });

  const [orderFormat, setOrderFormat] = useState("tasks");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarVisibleBuy, setCalendarVisibleBuy] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen max-sm:-mt-5 gap-10">
      <div>
        <form
          onSubmit={(e) =>
            handleSubmit(e, formData, setFormData, supabase, toast)
          }
          className="bg-white  shadow-xl rounded-2xl p-5 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 col-span-full text-center">
            ثبت سفارش فروش
          </h2>
          <div className="relative w-full group">
            <CreatableSelect
              styles={customStyles}
              options={defaultNames}
              value={
                formData.name
                  ? { value: formData.name, label: formData.name }
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  name: selectedOption ? selectedOption.value : "",
                })
              }
              placeholder="انتخاب یا افزودن نام"
              isClearable
            />

            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              نام
            </label>
          </div>

          <div className="relative w-full group">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={(e) => handleChange(e, formData, setFormData)}
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              تعداد
            </label>
          </div>

          <div className="relative w-full group">
            <input
              name="price"
              value={formData.price}
              onChange={(e) => handleChange(e, formData, setFormData)}
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              نرخ
            </label>
          </div>

          <div className="relative w-full group">
            <input
              type="text"
              name="total"
              value={formData.total}
              readOnly
              className="block py-2.5 px-0 w-full text-gray-500 bg-gray-100 outline-none border-0 border-b-2 border-gray-300 appearance-none cursor-not-allowed peer"
              placeholder=" "
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] pointer-events-none">
              جمع کل
            </label>
          </div>

          <div className="relative w-full group">
            <div
              onClick={() => setCalendarVisible(!calendarVisible)}
              className="cursor-pointer py-2.5 px-0 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500"
            >
              {/*  */}
              {formData.date
                ? formData.date
                : formData.date
                  ? formData.date
                  : "تاریخ را انتخاب کنید"}
            </div>
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              تاریخ
            </label>

            {calendarVisible && (
              <Calendar
                name="date"
                calendar={persian}
                locale={persian_fa}
                value={formData.date}
                onChange={(date) =>
                  handleDateChange(
                    date,
                    setFormData,
                    setCalendarVisible,
                    persian,
                  )
                }
              />
            )}
          </div>

          <div className="relative w-full group">
            <input
              type="text"
              name="delivery"
              value={formData.delivery}
              onChange={(e) => handleChange(e, formData, setFormData)}
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              تحویل دهنده
            </label>
          </div>

          <div className="relative w-full group col-span-full">
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e, formData, setFormData)}
              rows="2"
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer resize-none"
              placeholder=" "
            ></textarea>
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              توضیحات
            </label>
          </div>

          <button
            type="submit"
            onClick={() => setOrderFormat("buy")}
            className="col-span-full w-full py-3 bg-indigo-500 shadow-lg hover:ring-2 ring-blue-500 shadow-indigo-500/50 hover:cursor-pointer text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition duration-300"
          >
            ثبت سفارش
          </button>
        </form>
      </div>
      <div>
        {/* فرم خرید */}
        <form
          onSubmit={(e) =>
            handleSubmitBuy(e, formDataBuy, setFormDataBuy, supabase, toast)
          }
          className="bg-white  shadow-xl rounded-2xl p-5 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 col-span-full text-center">
            ثبت سفارش خرید
          </h2>
          <div className="relative w-full group">
            <CreatableSelect
              styles={customStyles}
              options={defaultNames}
              value={
                formDataBuy.name
                  ? { value: formDataBuy.name, label: formDataBuy.name }
                  : null
              }
              onChange={(selectedOption) =>
                setFormDataBuy({
                  ...formDataBuy,
                  name: selectedOption ? selectedOption.value : "",
                })
              }
              placeholder="انتخاب یا افزودن نام"
              isClearable
            />

            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              نام
            </label>
          </div>

          <div className="relative w-full group">
            <input
              type="number"
              name="quantity"
              value={formDataBuy.quantity}
              onChange={(e) => handleChangeBuy(e, formDataBuy, setFormDataBuy)}
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              تعداد
            </label>
          </div>

          <div className="relative w-full group">
            <input
              name="price"
              value={formDataBuy.price}
              onChange={(e) => handleChangeBuy(e, formDataBuy, setFormDataBuy)}
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              نرخ
            </label>
          </div>

          <div className="relative w-full group">
            <input
              type="text"
              name="total"
              value={formDataBuy.total}
              readOnly
              className="block py-2.5 px-0 w-full text-gray-500 bg-gray-100 outline-none border-0 border-b-2 border-gray-300 appearance-none cursor-not-allowed peer"
              placeholder=" "
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] pointer-events-none">
              جمع کل
            </label>
          </div>

          <div className="relative w-full group">
            <div
              onClick={() => setCalendarVisibleBuy(!calendarVisibleBuy)}
              className="cursor-pointer py-2.5 px-0 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500"
            >
              {/*  */}
              {formDataBuy.date
                ? formDataBuy.date
                : formDataBuy.date
                  ? formDataBuy.date
                  : "تاریخ را انتخاب کنید"}
            </div>
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              تاریخ
            </label>

            {calendarVisibleBuy && (
              <Calendar
                name="date"
                calendar={persian}
                locale={persian_fa}
                value={formDataBuy.date}
                onChange={(date) =>
                  handleDateChangeBuy(
                    date,
                    setFormDataBuy,
                    setCalendarVisibleBuy,
                    persian,
                  )
                }
              />
            )}
          </div>

          <div className="relative w-full group">
            <input
              type="text"
              name="delivery"
              value={formDataBuy.delivery}
              onChange={(e) => handleChangeBuy(e, formDataBuy, setFormDataBuy)}
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
            />
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              تحویل دهنده
            </label>
          </div>

          <div className="relative w-full group col-span-full">
            <textarea
              name="description"
              value={formDataBuy.description}
              onChange={(e) => handleChangeBuy(e, formDataBuy, setFormDataBuy)}
              rows="2"
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer resize-none"
              placeholder=" "
            ></textarea>
            <label className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
              توضیحات
            </label>
          </div>

          <button
            type="submit"
            className="col-span-full w-full py-3 bg-indigo-500 shadow-lg hover:ring-2 ring-blue-500 shadow-indigo-500/50 hover:cursor-pointer text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition duration-300"
          >
            ثبت سفارش
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
