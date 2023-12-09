export enum EStatusShipping {
    PENDING = "Đang chờ xác nhận",
    PREPARING = "Đang chuẩn bị hàng",
    IN_STORE = "Đang ở kho",
    DELIVER_RECEIVE_ITEM = "Người giao hàng đang lấy hàng",
    DELIVERING = "Đang giao tới chổ bạn",
    DELIVERED = "Đã giao",
    CANCEL = "Đã hủy",
}

export enum EOrder {
    CANCEL = "Đã hủy",
    ORDERED = "Đã đặt",
    DELIVERING = "Đang vận chuyển",
    REQUEST_REFUND = "Yêu cầu hoàn trả",
    FINISH = "Hoàn thành",
}
