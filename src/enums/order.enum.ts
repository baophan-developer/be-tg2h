export enum EStatusShipping {
    PENDING = "Đang chờ xác nhận",
    PREPARING = "Đang chuẩn bị hàng",
    IN_STORE = "Đang ở kho",
    DELIVER_RECEIVE_ITEM = "Người giao hàng đang lấy hàng",
    DELIVERING = "Đang giao tới chổ bạn",
    DELIVERED = "Đã giao",
}

export enum EOrder {
    ORDERED = "Đã đặt",
    CANCEL = "Đã hủy",
    FINISH = "Hoàn thành",
}
