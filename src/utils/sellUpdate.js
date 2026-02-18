import { toast } from "react-toastify";
import supabase from "../supabase";
import persian from "react-date-object/calendars/persian";
import { Calendar } from "react-multi-date-picker";

//Edit State Change
export const handleEdit = (order, setEditingId, setEditFormData) => {
  setEditingId(order.id);
  setEditFormData({
    name: order.name,
    quantity: order.quantity,
    price: order.price,
    description: order.description || "",
    date: order.date,
    total: order.total,
    delivery: order.delivery || "",
    status: order.status || "تسویه نشده",
  });
};

//Edit
export const handleEditChange = (e, setEditFormData, editFormData) => {
  const { name, value } = e.target;

  if (name === "price") {
    const numericValue = value.replace(/\D/g, "");
    const formattedPrice = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "/");

    const quantity = editFormData.quantity;
    const price = numericValue;

    setEditFormData({
      ...editFormData,
      price: formattedPrice,
      total: quantity && price ? (quantity * price).toLocaleString() : "",
    });
  } else if (name === "quantity") {
    const numericValue = value.replace(/\D/g, "");
    const formattedPrice = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "/");

    const quantity = value;
    const price = editFormData.price.replace(/\D/g, "");

    setEditFormData({
      ...editFormData,
      quantity: formattedPrice,
      total: quantity && price ? (quantity * price).toLocaleString() : "",
    });
  } else {
    setEditFormData({ ...editFormData, [name]: value });
  }
  console.log(editFormData);
};

//Delete
export const handleDateChange = (
  date,
  setEditFormData,
  editFormData,
  setCalendarVisible,
) => {
  console.log(date);
  setEditFormData({
    ...editFormData,
    date: date.format("YYYY/MM/DD", { Calendar: persian }),
  });
  setCalendarVisible(false);
};

//Update
export const handleUpdate = async (
  id,
  setEditingId,
  editFormData,
  setOrders,
  orders,
) => {
  if (!editFormData.quantity) {
    alert("لطفا مقادیر مورد نظر را وارد کنید");
    return;
  }
  const updatedData = {
    ...editFormData,
    date: editFormData.date,
  };

  const { error } = await supabase
    .from("tasks")
    .update(updatedData)
    .eq("id", id);

  if (error) {
    alert("Error updating order: " + error.message);
  } else {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, ...updatedData } : order,
      ),
    );
    console.log(id);
    setEditingId(null);
    toast.success("سفارشات با موفقیت بروزرسانی شد", {
      position: "top-left",
      style: {
        fontSize: "18px",
      },
    });
  }
};

//Cancel
export const handleCancel = (
  setEditingId,
  setCalendarVisible,
  setEditFormData,
) => {
  setEditingId(null);
  setCalendarVisible(false);

  setEditFormData({
    name: "",
    quantity: "",
    price: "",
    description: "",
    date: "",
    total: "",
    delivery: "",
    status: "",
  });
};

//Delete
export const handleDelete = async (id, orders, setOrders) => {
  console.log(orders);
  if (window.confirm("Are you sure you want to delete this order?")) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      alert("Error deleting order: " + error.message);
    } else {
      setOrders(orders.filter((order) => order.id !== id));
      toast.success("سفارش با موفقیت حذف شد", {
        position: "top-left",
        style: {
          fontSize: "18px",
        },
      });
    }
  }
};
